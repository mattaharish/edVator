myApp.directive('pieChartProgressBar', function() {
  return {
    restrict: 'A',
    scope: {
        percent: "=pieChartProgressBar"
    },
    link: function (scope, elem, attr, ctrl) {
      var el = elem[0];
      var options = {
        size: 220,
        lineWidth: 15,
        rotate: 0
      };

      var canvas = document.createElement('canvas');
      var span = document.createElement('span');

      if (typeof(G_vmlCanvasManager) !== 'undefined') {
        G_vmlCanvasManager.initElement(canvas);
      }

      var ctx = canvas.getContext('2d');
      canvas.width = canvas.height = options.size;

      el.appendChild(span);
      el.appendChild(canvas);

      ctx.translate(options.size / 2, options.size / 2);
      ctx.rotate((-1 / 2 + options.rotate / 180) * Math.PI);

      var radius = (options.size - options.lineWidth) / 2;

      var drawCircle = function(color, lineWidth, percent) {
        percent = Math.min(Math.max(0, percent || 1), 1);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
        ctx.strokeStyle = color;
        ctx.lineCap = 'round'; // butt, round or square
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      };

      drawCircle('#efefef', options.lineWidth, 100 / 100);

      scope.$watch('percent', function(value) {
        span.innerText = value + '%';
        drawCircle('#555555', options.lineWidth, value / 100);
      });
  
    }
  }
});