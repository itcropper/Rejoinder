
let rej = {
    hslToRgb: (h, s, l) => {
        var r, g, b;
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);

        return [Math.floor(r * 255), Math.floor(g * 210), Math.floor(b * 60)];
    },

    numberToColorHsl: (i) => {
        var hue = i * 1.2 / 360;
        var rgb = rej.hslToRgb(hue, 1, .5);
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
    }
}
