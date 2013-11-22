
// Description:  AnimateImages jQuery Plugin.
// Author:       Marcel Wijnands
// Demo:         http://demo.shynet.nl/animatedimages/
// Blog:         http://blog.shynet.nl/

(function ($) {

        var startAnimation = function (container, images, count, interval) {
            var imageIndex = 1;
            var image = new Image();
            image.src = images[imageIndex].src;
            container.append(image);
            var animate = function () {
                if (imageIndex < count) {
                    imageIndex++;
                } else {
                    imageIndex = 1;
                }
                image.src = images[imageIndex].src;
            };
            setInterval(animate, interval);
        }

        $.fn.animateImages = function(path, count, interval) {
            var images = [];
            for (var imageIndex = 1; imageIndex <= count; imageIndex++) {
                images[imageIndex] = new Image();
                images[imageIndex].src = path.replace("@", imageIndex);
            }
            $(this).each(function() {
                startAnimation($(this), images, count, interval);
            });
        };

})(jQuery);
