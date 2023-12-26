  let sidebar = document.querySelector(".sidebar_menu");
  let closeBtn = document.querySelector("#Button");
  let searchBtn = document.querySelector(".bx-search");

  closeBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
  });

  searchBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      menuBtnChange();
  });

  function menuBtnChange() {
      if (sidebar.classList.contains("open")) {
          closeBtn.classList.replace("bx-menu", "bxs-x-circle");
      } else {
          closeBtn.classList.replace("bxs-x-circle", "bx-menu");
      }
  }
