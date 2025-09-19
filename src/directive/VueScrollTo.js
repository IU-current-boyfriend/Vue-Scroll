
/****
 *  1. 完成锚点定位：
 *      点击左侧导航栏时，能够滚动对应页面的容器位置
 * 
 *  2. 当滚动的元素在进行滚动时，如果处于用户定义的锚点元素时，则抛出该锚点元素的id
 * 
 * 
 * notice: 观察者方案处理滚动导航栏高亮不可行
 * 
 * 
 * 
 */




class VueScrollTo {
  // 自定义指令的名称:v-scroll-to
  static PLUGINNAME = "scrollTo";
  
  // 带有指示条的导航栏
  static NAVINDICATENAME = "parent-nav";

  // 高亮类名
  static HIGHLIGHTNAME = "active";

  static calculatePercentage(numerator, denominator) {
    // 处理分母为0的情况
    if (denominator === 0) {
      return 0;
    }
    
    // 计算百分比并向上取整保留两位小数
    const percentage = (numerator / denominator) * 100;
    // 乘以100后向上取整，再除以100得到保留两位小数的结果
    const roundedUp = Math.ceil(percentage * 100) / 100;
    
    return roundedUp;
  }

  static install(app, options) {
    // app vue应用实例对象
    // options用户自定义配置
    // 获取自定义插件实例对象
    const vueScrollTo = new VueScrollTo(options)
    app.directive(VueScrollTo.PLUGINNAME, vueScrollTo);
    // 设置滚动的容器,防止app未挂载，找不到滚动元素
    Promise.resolve().then(() => {
      const appMounted = app._instance.isMounted;
      appMounted && vueScrollTo.init()
    })
  }
  
  // 建立导航之间的父子关系
  static findNavParent(el) {
    let currentNavParentElement = el.parentElement;
    while (currentNavParentElement) {
      if (currentNavParentElement.className.includes(VueScrollTo.NAVINDICATENAME)) break;
      currentNavParentElement = currentNavParentElement.parentElement;
    }
    return currentNavParentElement;
  }

  constructor(options) {
    // 默认配置,滚动的方式
    this.defaultOptions = {
      top: 0, // 沿着Y轴
      left: 0, // 沿着X轴
      behavior: 'smooth', // 平滑的过渡
      container: "body", // 滚动的容器元素
    }
    // 配置项
    this.options = this.combineOptions(options);
    // 观察者默认配置
    // this.observerOption = {
    //   root: this.getSectionByClassName(this.options.root),
    //   rootMargin: "0px",
    //   threshold: 0.1,
    // }

    // 当前点击的nav元素
    this.currentNav = null;
    // 当前滚动的元素
    this.scrollRoot = null;
    // 锚点与滚动的元素建立联系
    /**
     * {
     *    el: {
     *      sectionEl: xxx,
     *      id: xxx,
     *      position: [top, left] => top,left相对于滚动的容器位置
     *      // 可以采用InterSectionObserver处理滚动高亮的问题
     *    }
     * }
     * 
     */
    this.anchorElMap = new Map();
    this.anchorSectionGapMap = new Map();
    // 插件绑定的元素
    this.bindElMap = new Map();
    // 子导航栏与父级导航栏之间的映射
    this.parentNavMap = new Map();
    // // 观察者
    // this.observerList = new Set();
  }





  // 绑定指令的元素挂载
  mounted(el, binding) {
    // 获取插件实例对象
    const _this = binding.dir;
    // 创建绑定元素的关系
    _this.createBindingRelative(el, binding);
  }


  // 绑定指令的元素卸载
  beforeUnmount(el, binding) {}


  init() {
    this.scrollRoot = this.getSectionByClassName(this.options.root);
    // 建立锚点与滚动元素之间的关系
    this.createAnchorAndSectionRelative();
    // 创建锚点之间与父级导航栏之间的映射关系
    this.createAnchorParentRelative();
    // 处理section之间的gap区间
    this.createAnchorSectionGap();
    // 绑定锚点与滚动元素之间的点击事件
    this.bindEvent();
    // 通过Intersection建立起观察者的模式
    // this.bindScrollEvent();
    // this.intersectionObserverInit();
    console.log('this: =>,', this.anchorSectionGapMap);
    
    
  }


  // bindScrollEvent() {
  //   this.scrollRoot.addEventListener("scroll", this.rootScrollHandle.bind(this), false);
  // }

  // intersectionObserverInit() {
  //  this.anchorElMap.forEach((section) => {
  //     const observerInstance = new IntersectionObserver(this.observerHandle.bind(this), this.observerOption);
  //     observerInstance.observe(section.sectionEl);
  //     this.observerList.add(observerInstance);
  //  })
  // }
  

  /**
   * 观察者处理函数
   */
  // observerHandle(entries, observer) {
  //   entries.forEach(entry => {
  //     const { isIntersecting, target } = entry;
  //     console.log('entiry: =>', entry);
      
  //     // isIntersecting && this.updateCurrentNav();
  //     const sectionEL = this.anchorElMap.forEach(section => section.sectionEl === target);
  //   })
  //   // console.log('this: =>', this.anchorElMap);
    
  // }

  /**
   * 创建锚点与滚动元素之间的关系，根据bindElMap
   */
  createAnchorAndSectionRelative() {
    this.bindElMap.forEach((value, el) => this.setAnchorSection(value, el));
  }


  createAnchorSectionGap() {
    Array.from(this.anchorElMap).reduce((c, n, i, a) => {
      const [prevEl, prevSection] = c;
      const [nextEl, nextSection] = n;
      if (i === 1) {
        this.anchorSectionGapMap.set(prevEl, {
          nav: prevEl,
          top: [0, nextSection.position.top],
          rate: [0, nextSection.position.rate],
        })
      } else {
        this.anchorSectionGapMap.set(prevEl, {
          nav: prevEl,
          top: [prevSection.position.top, nextSection.position.top],
          rate: [prevSection.position.rate, nextSection.position.rate],
        });
      }
      if (i === a.length - 1) {
        this.anchorSectionGapMap.set(nextEl, {
          nav: nextEl,
          top: [nextSection.position.top, Infinity],
          rate: [prevSection.position.rate, Infinity],
        });
      }
      return n;
    });
    
  }

  createAnchorParentRelative() {
    this.bindElMap.forEach((value, el) => {
      this.parentNavMap.set(el, VueScrollTo.findNavParent(el));
    });
  }
  
  
  bindEvent() {
    // 绑定锚点的点击事件
    this.bindAnchorClickEvent();
    // 绑定滚动事件
    this.bindViewScrollEvent();
  }


  bindAnchorClickEvent() {
    this.anchorElMap.forEach((section, el) => {
      el.addEventListener("click", this.sliderAnchorSectionPositionHandle.bind(this, el, section.position), false);
    })
  }

  bindViewScrollEvent() {
    const scrollFn = this.scrollViewScrollHandle.bind(this);

    this.scrollFn = scrollFn;

    this.scrollRoot.addEventListener("scroll", scrollFn, false);
  }


  scrollFn() {
    // 对应的导航元素
    let highLightNavEl = null;
    // 滚动容器滚动的距离
    const scrollTop = this.scrollRoot.scrollTop;
    // 滑动的距离占据容器高度最大高度百分比
    // top的偏移度距离占据容器高度最大百分比
    const offsetHeight = this.scrollRoot.scrollHeight;


    // 获取容器最大滚动距离
    // 当前元素相对的top占据最大滑动距离的百分比
    // 现在滑动的距离占据最大滑动距离的百分比

    const scrollHeight = this.scrollRoot.scrollHeight - this.options.offsetTop;
    const maxScrollTop = this.scrollRoot.scrollHeight - this.scrollRoot.offsetHeight;

    const rate = VueScrollTo.calculatePercentage(scrollTop, maxScrollTop);
    
    for (const [el, section] of this.anchorSectionGapMap.entries()) {
      if (rate >= section.rate[0] && rate < section.rate[1]) {
        highLightNavEl = el;
        break;
      }
    }

    highLightNavEl && this.updateCurrentNav(highLightNavEl);
  }


  scrollViewScrollHandle() {
    
    // 对应的导航元素
    let highLightNavEl = null;
    // 滚动容器滚动的距离
    const scrollTop = this.scrollRoot.scrollTop;
    // 滑动的距离占据容器高度最大高度百分比
    // top的偏移度距离占据容器高度最大百分比
    const offsetHeight = this.scrollRoot.scrollHeight;


    // 获取容器最大滚动距离
    // 当前元素相对的top占据最大滑动距离的百分比
    // 现在滑动的距离占据最大滑动距离的百分比

    const scrollHeight = this.scrollRoot.scrollHeight - this.options.offsetTop;
    const maxScrollTop = this.scrollRoot.scrollHeight - this.scrollRoot.offsetHeight;

    const rate = VueScrollTo.calculatePercentage(scrollTop, maxScrollTop);
    
    for (const [el, section] of this.anchorSectionGapMap.entries()) {
      if (rate >= section.rate[0] && rate < section.rate[1]) {
        highLightNavEl = el;
        break;
      }
    }

    highLightNavEl && this.updateCurrentNav(highLightNavEl);
    
  }


  sliderAnchorSectionPositionHandle(el, position) {
    this.scrollRoot.removeEventListener("scroll", this.scrollFn);

    // 滚动视口
    this.scrollRoot.scrollTo({
      left: 0,
      top: position.top,
      behavior: 'smooth'
    });
    
    // 更新试图
    this.updateCurrentNav(el);

    // 重新监听
    setTimeout(() => this.bindViewScrollEvent(), 800);
  }


  updateCurrentNav(el) {
    // 更新当前所处的导航栏
    this.currentNav = el;
    // 设置需要高亮的元素逻辑
    this.setHighLightNavEl(el);
  }


  setHighLightNavEl(el) {
    // 排除异己
    this.parentNavMap.forEach((child, parent) => {
      parent.classList.remove(VueScrollTo.HIGHLIGHTNAME);
      child.classList.remove(VueScrollTo.HIGHLIGHTNAME);
    })
    // 设置自身
    const currentNavParentNav = this.parentNavMap.get(el);
    currentNavParentNav && currentNavParentNav.classList.toggle(VueScrollTo.HIGHLIGHTNAME);
    el.classList.toggle(VueScrollTo.HIGHLIGHTNAME);
  }


  
  // 获取相对文档的偏移量
  relativeViewPosition(el) {
    let offsetTop = el.offsetTop;
    let offsetParent = el.offsetParent;

    const maxScrollTop = this.scrollRoot.scrollHeight - this.scrollRoot.offsetHeight;

    const scrollHeight = this.scrollRoot.scrollHeight - this.options.offsetTop;

    while(offsetParent) {
      offsetTop += offsetParent.offsetTop;
      offsetParent = offsetParent.offsetParent;
    }

    // 算当前元素的高度占据滚动容器高度的百分比 


    return {
      top: offsetTop - this.options.offsetTop,
      rate: VueScrollTo.calculatePercentage(offsetTop, scrollHeight)
    }
  }

  // 设置锚点与滚动元素的映射
  setAnchorSection(args, el) {
    // 获取滚动元素
    const sectionEl = this.getSectionElById(args.value);
    // 获取滚动元素相对视口的位置
    const sectionElPosition = this.relativeViewPosition(sectionEl);
    // 设置映射
    this.anchorElMap.set(el, {
      id: args.idName,
      sectionEl,
      position: sectionElPosition
    });
  }


  /**
   * 根据元素id获取元素
   */

  getSectionElById(idName) {
    return document.getElementById(idName);
  }

  /**
   * 根据元素类名获取元素
   * @param {*} el 
   * @param {*} bindArg 
   */
  getSectionByClassName(className) {
    return document.getElementsByClassName(className)[0];
  }


  createBindingRelative(el, bindArg) {
    let { arg, modifiers, oldValue, value } = bindArg;
    value = value.replace("#", "");
    this.bindElMap.set(el, { arg, modifiers, oldValue, value });
  }



  // 合并配置项
  combineOptions(customOptions) {
    return Object.assign(this.defaultOptions, customOptions);
  }


}

export default VueScrollTo;