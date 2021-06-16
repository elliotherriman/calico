#!/usr/bin/env bash

cd templates
for folder in *
	do echo "$folder"
	rm -rf "$folder"/patches
	mkdir "$folder"/patches
	mkdir "$folder"/images
	cp ../{calico,ink}.js "$folder"/
	cp -r ../patches/* "$folder"/patches
	mkdir ../release
	zip -r ../release/"$folder" "$folder"/*
done
