#!bin/bash
set -x
set -e

if [ ! -d /etc/mysql/mariadb.conf.d ]; then
    mkdir -p /etc/mysql/mariadb.conf.d
fi
if [ ! -h /etc/mysql/mariadb.conf.d/90-nobleprog.cnf ]; then
    ln -s my.tiny.cnf /etc/mysql/mariadb.conf.d/90-nobleprog.cnf
fi
apt -y install mariadb-server
# echo "UPDATE user SET password = PASSWORD('asdf'), plugin='' where user='root'; FLUSH PRIVILEGES;" | mysql -B mysql
echo "SET PASSWORD FOR 'root'@localhost = PASSWORD('asdf'); FLUSH PRIVILEGES;" | sudo mysql -B mysql
# mysql -u root -e "SET PASSWORD FOR root@'localhost' = PASSWORD(‘asdf’);"
sed -i '/^password/s/=.*$/= asdf/' /etc/mysql/debian.cnf

