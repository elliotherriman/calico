#!/usr/bin/env bash

cd templates
for folder in *
	do echo "$folder"
	rm -rf "$folder"/patches
	mkdir "$folder"/patches
	cp ../engine/{calico,ink}.js "$folder"/
	cp -r ../engine/patches/* "$folder"/patches
	mkdir ../release
	zip -r ../release/"$folder" "$folder"/*
done
