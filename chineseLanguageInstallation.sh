#!/usr/bin/env bash
SR_LIB=$(python3 -c "import speech_recognition as sr, os.path as p; print(p.dirname(sr.__file__))")
sudo apt-get install --yes unzip
# sudo unzip -o fr-FR.zip -d "$SR_LIB"
# sudo chmod --recursive a+r "$SR_LIB/fr-FR/"
sudo unzip -o zh-CN.zip -d "$SR_LIB"
sudo chmod --recursive a+r "$SR_LIB/pocketsphinx-data/zh-CN/"
# sudo unzip -o it-IT.zip -d "$SR_LIB"
# sudo chmod --recursive a+r "$SR_LIB/it-IT/"