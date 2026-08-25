(() => {
  const body = document.body;
  const menuOpenClass = "sw--menu-open";
  const burger = document.querySelector(".sw--header__burger");
  const mobileMenu = document.querySelector(".sw--mobile-menu");
  const closeTriggers = Array.from(document.querySelectorAll("[data-close-menu]"));

  const openMenu = () => {
    body.classList.add(menuOpenClass);
    if (burger) {
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", "Menünü bağla");
    }
  };

  const closeMenu = () => {
    body.classList.remove(menuOpenClass);
    if (burger) {
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Menünü aç");
    }
  };

  const toggleMenu = () => {
    if (body.classList.contains(menuOpenClass)) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  if (closeTriggers.length) {
    closeTriggers.forEach((el) => {
      el.addEventListener("click", closeMenu);
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains(menuOpenClass)) {
      closeMenu();
    }
  });

  if (mobileMenu) {
    const links = Array.from(mobileMenu.querySelectorAll(".sw--mobile-menu__link"));
    links.forEach((link) => {
      link.addEventListener("click", () => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          closeMenu();
        } else if (href && href.includes("#") && !href.startsWith("http")) {
          setTimeout(closeMenu, 0);
        } else {
          closeMenu();
        }
      });
    });
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    if (resizeTimer) return;
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900 && body.classList.contains(menuOpenClass)) {
        closeMenu();
      }
      resizeTimer = null;
    }, 100);
  });

  const activeClass = "sw--is-active";
  const links = Array.from(document.querySelectorAll(".sw--header__link"));
  const header = document.querySelector(".sw--header");

  const sectionIds = links
    .map((link) => link.getAttribute("href"))
    .filter((href) => href && href.startsWith("#"))
    .map((href) => href.slice(1));

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el) => el !== null);

  const setActive = (targetLink) => {
    links.forEach((link) => link.classList.remove(activeClass));
    if (targetLink) {
      targetLink.classList.add(activeClass);
    }
  };

  const findLinkByHash = (hash) => {
    return links.find((link) => link.getAttribute("href") === hash);
  };

  const spyScroll = () => {
    const scrollPos = window.scrollY + (header ? header.offsetHeight + 80 : 120);
    let currentId = null;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        currentId = section.id;
        break;
      }
    }

    if (!currentId && sections.length > 0) {
      const lastSection = sections[sections.length - 1];
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 10) {
        currentId = lastSection.id;
      }
    }

    if (currentId) {
      const link = findLinkByHash(`#${currentId}`);
      if (link && !link.classList.contains(activeClass)) {
        setActive(link);
      }
    }
  };

  if (links.length) {
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") {
          e.preventDefault();
          return;
        }
        if (href.startsWith("#")) {
          e.preventDefault();
          const target = document.getElementById(href.slice(1));
          if (target) {
            const offsetTop = target.offsetTop - (header ? header.offsetHeight : 0);
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth"
            });
          }
        }
      });
    });

    if (location.hash) {
      const matched = findLinkByHash(location.hash);
      if (matched) {
        setActive(matched);
      }
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        setTimeout(() => {
          const offsetTop = target.offsetTop - (header ? header.offsetHeight : 0);
          window.scrollTo({ top: offsetTop });
        }, 0);
      }
    }
  }

  if (header) {
    const syncHeaderState = () => {
      header.classList.toggle("sw--is-scrolled", window.scrollY > 24);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
  }

  if (sections.length) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          spyScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    spyScroll();
  }

  if (window.jQuery && jQuery.fn.slick) {
    const initCardSlider = (sliderSelector, prevSelector, nextSelector) => {
      const $slider = jQuery(sliderSelector);

      if (!$slider.length || $slider.hasClass("slick-initialized")) return;

      $slider.slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        speed: 500,
        arrows: true,
        dots: false,
        prevArrow: jQuery(prevSelector),
        nextArrow: jQuery(nextSelector),
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              dots: true,
              arrows: false
            }
          }
        ]
      });
    };

    const initProjectsSlider = (sliderSelector, prevSelector, nextSelector) => {
      const $slider = jQuery(sliderSelector);

      if (!$slider.length || $slider.hasClass("slick-initialized")) return;

      $slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        speed: 500,
        arrows: true,
        dots: false,
        prevArrow: jQuery(prevSelector),
        nextArrow: jQuery(nextSelector),
        responsive: [
          {
            breakpoint: 900,
            settings: {
              dots: true,
              arrows: false
            }
          }
        ]
      });
    };

    initCardSlider(".sw--services__slider", ".sw--services__arrow--prev", ".sw--services__arrow--next");
    initProjectsSlider(".sw--projects__slider", ".sw--projects__arrow--prev", ".sw--projects__arrow--next");
    
    const $partnersSlider = jQuery(".sw--partners__slider");
    if ($partnersSlider.length && !$partnersSlider.hasClass("slick-initialized")) {
      $partnersSlider.slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        arrows: true,
        dots: false,
        prevArrow: jQuery(".sw--partners__arrow--prev"),
        nextArrow: jQuery(".sw--partners__arrow--next"),
        responsive: [
          {
            breakpoint: 1199,
            settings: {
              slidesToShow: 4
            }
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 3,
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 2,
              dots: true,
              arrows: false
            }
          },
          {
            breakpoint: 479,
            settings: {
              slidesToShow: 2,
              dots: true,
              arrows: false
            }
          }
        ]
      });
    }
  }
})();
