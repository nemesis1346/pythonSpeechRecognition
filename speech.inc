<Directory /home/apps/speech/react_front_end/build>
    Require all granted
    DirectoryIndex index.html
    Header set Cache-Control "no-cache"
    Header edit ETag "(.+)-gzip\"$" "$1\"" "expr=resp('Content-Encoding') == 'gzip'"
</Directory>
Alias "/speech/microphone" "/home/apps/speech/react_front_end/build"
Alias "/speech/transcript" "/home/apps/speech/react_front_end/build"
Alias "/speech/externalApp" "/home/apps/speech/react_front_end/build"
ProxyPass "/speech/backend" "http://127.0.0.1:2245/backend"
ProxyPassReverse "/speech/backend" "http://127.0.0.1:2245/backend"
