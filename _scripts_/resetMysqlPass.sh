
#!/bin/bash

# mysqld --console --skip-grant-tables --shared-memory

systemctl stop mysql
mysqld --skip-grant-tables --user=mysql &
mysqld --init-file=./mysqlPass.txt --console
mysqld --initialize --console
systemctl start mysql
