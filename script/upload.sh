#! /bin/bash

# ../dist/main.js -> ./main.js
cat html/index.html | sed -e "s/\.\.\/dist\/main\.js/\.\/main\.js/g" > index.html
cp dist/main.js ./main.js

scp ./index.html rootnir:/var/www/mandelbrot-map/
scp ./main.js rootnir:/var/www/mandelbrot-map/

rm ./index.html
rm ./main.js