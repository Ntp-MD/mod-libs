/**
 * ModFillText.js v1.0.0
 * Copyright (c) 2026 idea by Natthapon Srimode
 * * ความภูมิใจของนักพัฒนา: ระบบปรับขนาดฟอนต์อัตโนมัติตามสัดส่วนพื้นที่
 * - คำนวณจาก Pixel จริง ไม่ใช่วิธีกะระยะ
 * - ควบคุมผ่าน HTML Attributes 100%
 * - รองรับ Responsive และ Google Fonts
 */

$(function () {
  const modResizer = function () {
    $("[AimSize]").each(function () {
      var $el = $(this);
      var $parent = $el.closest("[parent-mark]").length ? $el.closest("[parent-mark]") : $el.parent();

      var fillPercent = parseFloat($el.attr("AimSize")) || 100;
      var minSize = parseFloat($el.attr("MinSize")) || 0;
      var parentWidth = $parent.innerWidth();
      if (parentWidth <= 0) return;

      var targetWidth = parentWidth * (fillPercent / 100);

      // --- ระบบวัดขนาดด้วย Canvas ---
      var text = $el.text();
      var fontInfo = $el.css("font-weight") + " 100px " + $el.css("font-family");
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      context.font = fontInfo;
      var currentWidth = context.measureText(text).width;

      if (currentWidth > 0) {
        var newFontSize = (targetWidth / currentWidth) * 100;
        if (newFontSize < minSize) newFontSize = minSize;

        $el.css({
          "font-size": newFontSize + "px",
          display: "block",
          "white-space": "nowrap",
        });
      }
    });
  };

  if (document.fonts) {
    document.fonts.ready.then(modResizer);
  }
  $(window).on("resize", function () {
    clearTimeout(this.t);
    this.t = setTimeout(modResizer, 100);
  });
  modResizer();
});
