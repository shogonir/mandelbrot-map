#! /bin/bash

scp ./index.html rootnir:/var/www/mandelbrot-map/
scp -r ./dist rootnir:/var/www/mandelbrot-map/
