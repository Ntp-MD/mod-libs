/**
 * ModFillText.js v1.0.0
 * Copyright (c) 2026 idea by Natthapon Srimode
 */
(function ($) {
  const modResizer = function () {
    $("[AimSize]").each(function () {
      const $el = $(this);
      const $parent = $el.closest("[parent-mark]").length ? $el.closest("[parent-mark]") : $el.parent();

      // ดึงค่าและลบ % ออกถ้ามี
      let rawAim = $el.attr("AimSize") || "100";
      const fillPercent = parseFloat(rawAim.replace("%", "")) || 100;
      const minSize = parseFloat($el.attr("MinSize")) || 0;

      const parentWidth = $parent.innerWidth();
      if (parentWidth <= 0) return;

      const targetWidth = parentWidth * (fillPercent / 100);

      // --- ระบบวัดขนาดด้วย Canvas ---
      const text = $el.text().trim();
      const style = window.getComputedStyle($el[0]);
      const fontInfo = `${style.fontWeight} 100px ${style.fontFamily}`;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = fontInfo;
      const currentWidth = context.measureText(text).width;

      if (currentWidth > 0) {
        let newFontSize = (targetWidth / currentWidth) * 100;
        if (newFontSize < minSize) newFontSize = minSize;

        $el.css({
          "font-size": newFontSize + "px",
          display: "block",
          "white-space": "nowrap",
          "line-height": "1.2", // ป้องกันบรรทัดซ้อนกันเมื่อฟอนต์ใหญ่ขึ้น
        });
      }
    });
  };

  $(function () {
    if (document.fonts) {
      document.fonts.ready.then(modResizer);
    }

    let t;
    $(window).on("resize", function () {
      clearTimeout(t);
      t = setTimeout(modResizer, 150);
    });

    // รันทันที
    modResizer();
    // รันซ้ำอีกครั้งเผื่อกรณีรูปภาพหรือ layout ขยับทีหลัง
    setTimeout(modResizer, 500);
  });
})(jQuery);
