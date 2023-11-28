## Некоторые подготовительные действия

```bash
apt install unzip
```

## Установка PHP 8.2

```bash
add-apt-repository ppa:ondrej/php

apt update

apt install php php-fpm php-cli php8.2-mysql php-json php8.2-gmp php8.2-imap php-gd php-ldap php-odbc php8.2-common php8.2-opcache php-pear php-xml php-xmlrpc php-mbstring php-snmp php-soap php-zip php-curl php-imagick php-intl
```
Возможно, в последней команде в списке пакетов есть что-то лишнее, не разбирался. Но в итоге после этого нужно снести apache, т.к. у нас используется nginx.

```bash
apt purge apache2 apache2-utils apache2-bin apache2.2-bin 
```

## Установка MariaDB

```bash
apt install mariadb-server
mysql_secure_installation
```
В процессе конфигурирования заданы следующие опции:
* Задан root пароль (см. mariadb_root_password в secrets)
* Remove anonymous users? [Y/n] Y
* Disallow root login remotely? [Y/n] Y
* Remove test database and access to it? [Y/n] Y
* Reload privilege tables now? [Y/n] Y

Добавим пользователя administrator (см. mariadb_administrator_password в secrets)

```bash
mariadb
```

```sql
GRANT ALL ON *.* TO 'administrator'@'localhost' IDENTIFIED BY 'здесь_должен_быть_пароль' WITH GRANT OPTION;
FLUSH PRIVILEGES;
exit
```

Создадим БД для сайта (в ней хранятся пользователи, новости и прочие страницы, сообщения форума, настройки и т.п.). Параметры будут, допустим, такие:

* wp_database: wordpressdatabase
* wp_user: wordpressadministrator
* wp_password: см. secrets


```bash
mariadb
```

```sql
CREATE DATABASE wordpressdatabase;
CREATE USER "wordpressadministrator"@"localhost" IDENTIFIED BY "здесь_должен_быть_пароль";
GRANT ALL PRIVILEGES ON wordpressdatabase.* TO "wordpressadministrator"@"localhost";
FLUSH PRIVILEGES;  
EXIT
```

## Установка WordPress

```bash
mkdir /var/www/wordpress
cd /var/www/wordpress
curl https://wordpress.org/latest.zip -O
unzip latest.zip -d ..
rm latest.zip
```

Убираем в сторонку дефолтный index.php, т.к. не планируем им пользоваться.

```bash
mv index.php _index.php
nano /etc/nginx/sites-available/wordpress.config
```

### Конфиг /etc/nginx/sites-available/wordpress.config

```
# Upstream to abstract backend connection(s) for php
upstream php {
        server unix:/run/php/php8.2-fpm.sock;
        server 127.0.0.1:9000;
}

server {
        listen 9000;
        ## Your website name goes here.
        server_name _;
        ## Your only path reference.
        root /var/www/wordpress;
        ## This should be in your http block and if it is, it's not needed here.
        index index.php;

        location = /favicon.ico {
                log_not_found off;
                access_log off;
        }

        location = /robots.txt {
                allow all;
                log_not_found off;
                access_log off;
        }

        location / {
                # This is cool because no php is touched for static content.
                # include the "?$args" part so non-default permalinks doesn't break when using query string
                try_files $uri $uri/ /index.php?$args;
        }

        location ~ \.php$ {
                #NOTE: You should have "cgi.fix_pathinfo = 0;" in php.ini
                include fastcgi_params;
                fastcgi_intercept_errors on;
                fastcgi_pass php;
                #The following parameter can be also included in fastcgi_params file
                fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
                expires max;
                log_not_found off;
        }
}


```
Кладём конфиг (точнее, символическую ссылку) в sites-enabled, чтобы его "активировать", и после перезапуска сервиса сайт должен начать работать.

```bash
ln -s /etc/nginx/sites-available/wordpress.config /etc/nginx/sites-enabled/
service nginx restart
```

Разрешения выставлены такие. Скорее всего, по умолчанию они такие и есть, тогда не обязательно выполнять:

```bash
find /var/www/wordpress/ -type d -exec chmod 755 {} \;
find /var/www/wordpress/ -type f -exec chmod 644 {} \;
```

Переходим по ссылке:

http://di-finsim.ru/wp-admin/

Указываем все параметры...
```
Database Name:  wordpressdatabase
Username:       wordpressadministrator
Password:       см. secrets (wp_password)
Database Host:  localhost
Table Prefix:   wp_
```

На странице будет сгенерировано содержимое, которое необходимо поместить в файл /var/www/wordpress/wp-config.php

Продолжаем процесс установки в браузере:
```
Название сайта: FinSim
Имя пользователя: finsimadmin (wp_site_admin_name в secrets)
Пароль: см. secrets (wp_site_admin_password)
E-mail: admin@di-finsim.ru (можно указать другой ящик, смена ящика возможна из UI через email подтверждение, или напрямую в БД wordpress в таблице wp_options)
Попросить поисковые системы не индексировать сайт - не ставил галку
```

Ссылка для входа на сайт:
http://di-finsim.ru/wp-login.php


# Настройка почтового сервера
В этой инструкции всё сокращено до списка выполняемых команд, практически без пояснений. В оригинальной статье рассказ более подробный, рекомендуется ознакомиться:

https://serveradmin.ru/nastrojka-postfix-dovecot-postfixadmin-roundcube-dkim-na-debian/

```bash
apt install acl
```

## phpmyadmin (опционально, для администрирования БД через веб интерфейс)
```bash
apt install phpmyadmin
```
Во время установки будут предложены конфигурации веб сервера, отказаться.
От конфигурирования БД тоже можно отказаться.

Самостоятельно сделаем конфиг для nginx.

```bash
mkdir /var/www/admin/
ln -s /usr/share/phpmyadmin /var/www/admin/phpmyadmin
apt install apache2-utils
htpasswd -c /etc/nginx/.htpasswd pmauser01
```

Последней командой добавили пользователя pmauser01 с паролем (см. secrets, htpasswd_user & htpasswd_password).

``` bash
nano /etc/nginx/sites-available/admin.config
```

### Конфиг /etc/nginx/sites-available/admin.config
```
server {
	listen 9080 default_server;

	root /var/www/admin;
	index index.html index.htm index.nginx-debian.html index.php;
	server_name _;

        auth_basic           "Administrator’s Area";
	auth_basic_user_file /etc/nginx/.htpasswd;

	location / {
		try_files $uri $uri/ =404;
	}

	location ~ \.php$ {
		include snippets/fastcgi-php.conf;
		fastcgi_pass unix:/run/php/php8.2-fpm.sock;
	}
}
```

```bash
ln -s /etc/nginx/sites-available/admin.config /etc/nginx/sites-enabled/
nginx -t # если всё ок, перезапускаем nginx
service nginx restart
```
Теперь по адресу di-finsim.ru:9080/phpmyadmin можно попасть в UI для администрирования баз данных. Мы включили basic auth, nginx запросит логин и пароль (см. secrets, htpasswd_user & htpasswd_password).

Далее для входа в панель можно использовать логин и пароль (см. secrets, mariadb_administrator_...)

## postfixadmin
Необходимо создать базу данных и пользователя для postfix.
Это можно сделать в UI phpmyadmin или в командной строке. Пароль в secrets (postfix).


```bash
mariadb
```


```sql
CREATE DATABASE postfix;
CREATE USER "postfix"@"localhost" IDENTIFIED BY "здесь_должен_быть_пароль";
GRANT ALL PRIVILEGES ON postfix.* TO "postfix"@"localhost";
FLUSH PRIVILEGES;  
EXIT
```

Необходимо установить postfix

```bash
wget https://github.com/postfixadmin/postfixadmin/archive/refs/tags/postfixadmin-3.3.13.tar.gz
tar xzvf postfixadmin-3.3.13.tar.gz
mv postfixadmin-postfixadmin-3.3.13 /var/www/admin/postfixadmin
rm postfixadmin-3.3.13.tar.gz 
chown -R www-data:www-data /var/www/admin/postfixadmin
cp /var/www/admin/postfixadmin/config.inc.php /var/www/admin/postfixadmin/config.local.php
nano /var/www/admin/postfixadmin/config.local.php
```

Рекомендуется ознакомиться с комментариями по каждому (особенно изменяемому) параметру в дефолтном файле config.inc.php. Также в оригинальной статье есть пояснения.

Такой конфиг получился после внесения изменений. Пароли в secrets (postfix).
```
<?php
global $CONF;
$CONF['configured'] = true;
$CONF['setup_password'] = 'changeme';
$CONF['default_language'] = 'ru';
$CONF['language_hook'] = '';
$CONF['database_type'] = 'mysqli';
$CONF['database_host'] = 'localhost';
$CONF['database_user'] = 'postfix';
$CONF['database_password'] = '__________ЗДЕСЬ_ДОЛЖЕН_БЫТЬ_ПАРОЛЬ_СМ_SECRETS__________';
$CONF['database_name'] = 'postfix';
$CONF['database_use_ssl'] = false;
$CONF['database_ssl_key'] = NULL;
$CONF['database_ssl_cert'] = NULL;
$CONF['database_ssl_ca'] = NULL;
$CONF['database_ssl_ca_path'] = NULL;
$CONF['database_ssl_cipher'] = NULL;
$CONF['database_ssl_verify_server_cert'] = true;
$CONF['database_socket'] = '';
$CONF['database_prefix'] = '';
$CONF['database_tables'] = array (
    'admin' => 'admin',
    'alias' => 'alias',
    'alias_domain' => 'alias_domain',
    'config' => 'config',
    'domain' => 'domain',
    'domain_admins' => 'domain_admins',
    'fetchmail' => 'fetchmail',
    'log' => 'log',
    'mailbox' => 'mailbox',
    'vacation' => 'vacation',
    'vacation_notification' => 'vacation_notification',
    'quota' => 'quota',
	'quota2' => 'quota2',
);
$CONF['admin_email'] = 'admin@di-finsim.ru';
$CONF['admin_smtp_password'] = '';
$CONF['admin_name'] = 'Postmaster';
$CONF['smtp_server'] = 'localhost';
$CONF['smtp_port'] = '25';
$CONF['smtp_client'] = '';
$CONF['smtp_sendmail_tls'] = 'NO';
$CONF['encrypt'] = 'md5crypt';
$CONF['authlib_default_flavor'] = 'md5raw';
$CONF['dovecotpw'] = "/usr/sbin/doveadm pw";
if(@file_exists('/usr/bin/doveadm')) { // @ to silence openbase_dir stuff; see https://github.com/postfixadmin/postfixadmin/issues/171
    $CONF['dovecotpw'] = "/usr/bin/doveadm pw"; # debian
}
$CONF['password_validation'] = array(
    '/.{5}/'                => 'password_too_short 5',      # minimum length 5 characters
    '/([a-zA-Z].*){3}/'     => 'password_no_characters 3',  # must contain at least 3 characters
    '/([0-9].*){2}/'        => 'password_no_digits 2',      # must contain at least 2 digits
);
$CONF['generate_password'] = 'NO';
$CONF['show_password'] = 'NO';
$CONF['page_size'] = '10';
$CONF['default_aliases'] = array (
    'abuse' => 'root',
    'hostmaster' => 'root',
    'postmaster' => 'root',
    'webmaster' => 'root'
);
$CONF['domain_path'] = 'YES';
$CONF['domain_in_mailbox'] = 'YES';
$CONF['maildir_name_hook'] = 'NO';
$CONF['admin_struct_hook']          = '';
$CONF['domain_struct_hook']         = '';
$CONF['alias_struct_hook']          = '';
$CONF['mailbox_struct_hook']        = '';
$CONF['alias_domain_struct_hook']   = '';
$CONF['fetchmail_struct_hook']      = '';
$CONF['aliases'] = '10';
$CONF['mailboxes'] = '10';
$CONF['maxquota'] = '10';
$CONF['domain_quota_default'] = '2048';
$CONF['quota'] = 'NO';
$CONF['domain_quota'] = 'YES';
$CONF['quota_multiplier'] = '1024000';
$CONF['quota_level_med_pct'] = 55;
$CONF['quota_level_high_pct'] = 90;
$CONF['transport'] = 'NO';
$CONF['transport_options'] = array (
    'virtual',  // for virtual accounts
    'local',    // for system accounts
    'relay'     // for backup mx
);
$CONF['transport_default'] = 'virtual';
$CONF['vacation'] = 'NO';
$CONF['vacation_domain'] = 'autoreply.change-this-to-your.domain.tld';
$CONF['vacation_control'] ='YES';
$CONF['vacation_control_admin'] = 'YES';
$CONF['vacation_choice_of_reply'] = array (
   0 => 'reply_once',        // Sends only Once the message during Out of Office
   60*60 *24*7 => 'reply_once_per_week'        // Reply if last autoreply was at least a week ago
);
$CONF['edit_alias'] = 'YES';
$CONF['alias_control'] = 'YES';
$CONF['alias_control_admin'] = 'YES';
$CONF['special_alias_control'] = 'NO';
$CONF['alias_goto_limit'] = '0';
$CONF['alias_domain'] = 'YES';
$CONF['backup'] = 'NO';
$CONF['sendmail'] = 'YES';
$CONF['sendmail_all_admins'] = 'NO';
$CONF['logging'] = 'YES';
$CONF['fetchmail'] = 'YES';
$CONF['fetchmail_extra_options'] = 'NO';
$CONF['show_header_text'] = 'NO';
$CONF['header_text'] = ':: Postfix Admin ::';
$CONF['show_footer_text'] = 'YES';
$CONF['footer_text'] = 'Return to di-finsim.ru';
$CONF['footer_link'] = 'http://di-finsim.ru';
$CONF['motd_user'] = '';
$CONF['motd_admin'] = '';
$CONF['motd_superadmin'] = '';
$CONF['welcome_text'] = <<<EOM
Здравствуйте,
Добро пожаловать в ваш новый аккаунт.
EOM;
$CONF['emailcheck_resolve_domain']='YES';
$CONF['show_status']='YES';
$CONF['show_status_key']='YES';
$CONF['show_status_text']='&nbsp;&nbsp;';
$CONF['show_undeliverable']='YES';
$CONF['show_undeliverable_color']='tomato';
$CONF['show_undeliverable_exceptions']=array("unixmail.domain.ext","exchangeserver.domain.ext");
$CONF['show_expired']='YES';
$CONF['show_expired_color']='orange';
$CONF['show_vacation']='YES';
$CONF['show_vacation_color']='turquoise';
$CONF['show_disabled']='YES';
$CONF['show_disabled_color']='grey';
$CONF['show_popimap']='YES';
$CONF['show_popimap_color']='darkgrey';
$CONF['show_custom_domains']=array("subdomain.domain.ext","domain2.ext");
$CONF['show_custom_colors']=array("lightgreen","lightblue");
$CONF['recipient_delimiter'] = "";
$CONF['mailbox_postcreation_script'] = '';
$CONF['mailbox_postedit_script'] = '';
$CONF['mailbox_postdeletion_script'] = '';
$CONF['domain_postcreation_script'] = '';
$CONF['domain_postdeletion_script'] = '';
$CONF['create_mailbox_subdirs'] = array();
$CONF['create_mailbox_subdirs_host']='localhost';
$CONF['create_mailbox_subdirs_prefix']='INBOX.';
$CONF['used_quotas'] = 'NO';
$CONF['new_quota_table'] = 'YES';
$CONF['create_mailbox_subdirs_hostoptions'] = array();
$CONF['forgotten_user_password_reset'] = true;
$CONF['forgotten_admin_password_reset'] = false;
$CONF['sms_send_function'] = '';
$CONF['theme'] = 'default';
$CONF['theme_favicon'] = 'images/favicon.ico';
$CONF['theme_logo'] = 'images/logo-default.png';
$CONF['theme_css'] = 'css/bootstrap.css';
$CONF['theme_custom_css'] = '';
$CONF['xmlrpc_enabled'] = false;
$CONF['password_expiration'] = 'YES';
$CONF['version'] = '3.3.11';
if (file_exists(dirname(__FILE__) . '/config.local.php')) {
    require_once(dirname(__FILE__) . '/config.local.php');
}
```

```bash
mkdir /var/www/admin/postfixadmin/templates_c
chown -R www-data:www-data /var/www/admin/postfixadmin/templates_c
```

По адресу http://di-finsim.ru:9080/postfixadmin/public/setup.php начинаем установку postfixadmin.

Вводим setup_password: (см. secrets), генерируем hash, прописываем в config.local.php вместо 'changeme'.

Перезагружаем страницу, завершаем установку.

И теперь нужно добавить учётную запись администратора панели управления root@di-finsim.ru (см. sercets, superadmin_password).

Используя созданную учётную запись, можно авторизоваться в панели управления. Для этого перейдите по ссылке http://di-finsim.ru:9080/postfixadmin/public/login.php

Сразу же добавим наш домен в список почтовых доменов. Идем в раздел Список доменов -> Новый домен и добавляем свой домен. 

Также добавим администратора домена: admin@di-finsim.ru см. secrets, domain_admin_password.

И создадим почтовый ящик:

admin@di-finsim.ru

Пароль в secrets в разделе "E-mail".

## Настройка postfix
```bash
apt install postfix postfix-mysql ca-certificates
```
(в процессе выбираем No Configuration)

```bash
cp /etc/postfix/main.cf.proto /etc/postfix/main.cf
nano /etc/postfix/main.cf
```

Вот готовый конфиг:
```
soft_bounce = no
queue_directory = /var/spool/postfix
command_directory = /usr/sbin
daemon_directory = /usr/lib/postfix/sbin
data_directory = /var/lib/postfix
mail_owner = postfix

myhostname = mail.di-finsim.ru
mydomain = di-finsim.ru
myorigin = $myhostname

inet_interfaces = all
inet_protocols = ipv4

mydestination = localhost.$mydomain, localhost
unknown_local_recipient_reject_code = 550
mynetworks = 127.0.0.0/8

alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases

smtpd_banner = $myhostname ESMTP $mail_name

debug_peer_level = 2
# Строки с PATH и ddd должны быть с отступом в виде табуляции от начала строки
debugger_command =
    PATH=/bin:/usr/bin:/usr/local/bin:/usr/X11R6/bin
    ddd $daemon_directory/$process_name $process_id & sleep 5

setgid_group = postdrop
html_directory = no

relay_domains = mysql:/etc/postfix/mysql/relay_domains.cf
virtual_alias_maps = mysql:/etc/postfix/mysql/virtual_alias_maps.cf,
 mysql:/etc/postfix/mysql/virtual_alias_domain_maps.cf
virtual_mailbox_domains = mysql:/etc/postfix/mysql/virtual_mailbox_domains.cf
virtual_mailbox_maps = mysql:/etc/postfix/mysql/virtual_mailbox_maps.cf

smtpd_discard_ehlo_keywords = etrn, silent-discard
smtpd_forbidden_commands = CONNECT GET POST
broken_sasl_auth_clients = yes
smtpd_delay_reject = yes
smtpd_helo_required = yes
smtp_always_send_ehlo = yes
disable_vrfy_command = yes

smtpd_helo_restrictions = permit_mynetworks,
 permit_sasl_authenticated,
 reject_non_fqdn_helo_hostname,
 reject_invalid_helo_hostname

smtpd_data_restrictions = permit_mynetworks,
 permit_sasl_authenticated,
 reject_unauth_pipelining,
 reject_multi_recipient_bounce,

smtpd_sender_restrictions = permit_mynetworks,
 permit_sasl_authenticated,
 reject_non_fqdn_sender,
 reject_unknown_sender_domain

smtpd_recipient_restrictions = permit_mynetworks,
 permit_sasl_authenticated,
 reject_non_fqdn_recipient,
 reject_unknown_recipient_domain,
 reject_multi_recipient_bounce,
 reject_unauth_destination,

smtp_tls_security_level = may
smtp_tls_loglevel = 1
smtpd_tls_security_level = may
smtpd_tls_loglevel = 1
smtpd_tls_received_header = yes
smtpd_tls_session_cache_timeout = 3600s
smtp_tls_session_cache_database = btree:$data_directory/smtp_tls_session_cache
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtpd_tls_key_file = /etc/postfix/certs/key.pem
smtpd_tls_cert_file = /etc/postfix/certs/cert.pem
tls_random_source = dev:/dev/urandom
smtpd_tls_mandatory_ciphers = low
smtpd_tls_ciphers = low
smtpd_tls_mandatory_protocols = !SSLv2,!SSLv3
smtp_tls_mandatory_protocols  = !SSLv2,!SSLv3
smtp_tls_ciphers = low
smtp_tls_mandatory_ciphers = low
smtp_tls_protocols = !SSLv2,!SSLv3
smtp_tls_policy_maps = hash:/etc/postfix/tls_policy_maps
# фиксировать в логе имена серверов, выдающих сообщение STARTTLS, поддержка TLS для которых не включена
smtp_tls_note_starttls_offer = yes

# Ограничение максимального размера письма в байтах
message_size_limit = 20000000
smtpd_soft_error_limit = 10
smtpd_hard_error_limit = 15
smtpd_error_sleep_time = 20
anvil_rate_time_unit = 60s
smtpd_client_connection_count_limit = 20
smtpd_client_connection_rate_limit = 30
smtpd_client_message_rate_limit = 30
smtpd_client_event_limit_exceptions = 127.0.0.0/8
smtpd_client_connection_limit_exceptions = 127.0.0.0/8

maximal_queue_lifetime = 1d
bounce_queue_lifetime = 1d

smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth

# Директория для хранения почты
virtual_mailbox_base = /mnt/mail
virtual_minimum_uid = 1100
virtual_uid_maps = static:1100
virtual_gid_maps = static:1100
virtual_transport = dovecot
dovecot_destination_recipient_limit = 1

sender_bcc_maps = hash:/etc/postfix/sender_bcc_maps
recipient_bcc_maps = hash:/etc/postfix/recipient_bcc_maps

#compatibility_level=3.6
compatibility_level=2



smtpd_milters = inet:127.0.0.1:8891
non_smtpd_milters = $smtpd_milters
milter_default_action = accept
milter_protocol = 2
```

```bash
mkdir /etc/postfix/mysql && cd /etc/postfix/mysql
```

```bash
nano relay_domains.cf
```

Cодержимое relay_domains.cf:
```
hosts = 127.0.0.1:3306
user = postfix
password = ЗДЕСЬ_ПАРОЛЬ_БД_POSTFIX
dbname = postfix
query = SELECT domain FROM domain WHERE domain='%s' and backupmx = '1'
```


```bash
nano virtual_alias_domain_maps.cf
```

Содержимое virtual_alias_domain_maps.cf:
```
hosts = 127.0.0.1:3306
user = postfix
password = ЗДЕСЬ_ПАРОЛЬ_БД_POSTFIX
dbname = postfix
query = SELECT goto FROM alias,alias_domain WHERE alias_domain.alias_domain = '%d' and alias.address = CONCAT('%u', '@', alias_domain.target_domain) AND alias.active = 1
```


```bash
nano virtual_alias_maps.cf
```
Содержимое virtual_alias_maps.cf:
```
hosts = 127.0.0.1:3306
user = postfix
password = ЗДЕСЬ_ПАРОЛЬ_БД_POSTFIX
dbname = postfix
query = SELECT goto FROM alias WHERE address='%s' AND active = '1'
```

```bash
nano virtual_mailbox_domains.cf
```
Содержимое virtual_mailbox_domains.cf:
```
hosts = 127.0.0.1:3306
user = postfix
password = ЗДЕСЬ_ПАРОЛЬ_БД_POSTFIX
dbname = postfix
query = SELECT domain FROM domain WHERE domain='%s' AND backupmx = '0' AND active = '1'
```

```bash
nano virtual_mailbox_maps.cf
```
Содержимое virtual_mailbox_maps.cf:
```
hosts = 127.0.0.1:3306
user = postfix
password = ЗДЕСЬ_ПАРОЛЬ_БД_POSTFIX
dbname = postfix
query = SELECT maildir FROM mailbox WHERE username='%s' AND active = '1'
```

```bash
nano /etc/postfix/tls_policy_maps
```
Содержимое tls_policy_maps:
```
217.28.220.172  encrypt protocols=TLSv1
```

Выполнить:
```bash
postmap /etc/postfix/tls_policy_maps
```

```bash
# Бэкапим оригинальный конфиг
cp /etc/postfix/master.cf /etc/postfix/master.cf.orig
```

```bash
nano /etc/postfix/master.cf
```

Конфиг /etc/postfix/master.cf:
```
submission inet n       -       n       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_reject_unlisted_recipient=no
  -o smtpd_recipient_restrictions=
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING

smtps inet n - n - - smtpd
 -o syslog_name=postfix/smtps
 -o smtpd_tls_wrappermode=yes
 -o smtpd_sasl_auth_enable=yes
 -o smtpd_recipient_restrictions=permit_mynetworks,permit_sasl_authenticated,reject
 -o smtpd_relay_restrictions=permit_mynetworks,permit_sasl_authenticated,defer_unauth_destination
 -o milter_macro_daemon_name=ORIGINATING

dovecot unix - n n - - pipe
 flags=DRhu user=vmail:vmail argv=/usr/lib/dovecot/deliver -f ${sender} -d ${recipient}
```


```bash
mkdir /etc/postfix/certs
openssl req -new -x509 -days 3650 -nodes -out /etc/postfix/certs/cert.pem -keyout /etc/postfix/certs/key.pem
```
При создании сертификата были указаны некоторые данные dacha.industries@gmail.com

Ещё немного...
```bash
echo "@di-finsim.ru all_in@di-finsim.ru" > /etc/postfix/recipient_bcc_maps
echo "@di-finsim.ru all_out@di-finsim.ru" > /etc/postfix/sender_bcc_maps
postmap /etc/postfix/recipient_bcc_maps /etc/postfix/sender_bcc_maps
```
Теперь нужно создать два почтовых ящика (в UI postfixadmin):
all_in@di-finsim.ru и all_out@di-finsim.ru

```bash
apt install dovecot-imapd dovecot-pop3d dovecot-mysql dovecot-sieve dovecot-managesieved dovecot-lmtpd

cp /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf.orig
```

dovecot.conf:
```
listen = *

mail_plugins = mailbox_alias acl
protocols = imap pop3 sieve lmtp

mail_uid = 1100
mail_gid = 1100

first_valid_uid = 1100
last_valid_uid = 1100

auth_verbose = yes
log_path = /var/log/dovecot/main.log
info_log_path = /var/log/dovecot/info.log
debug_log_path = /var/log/dovecot/debug.log

ssl_min_protocol = SSLv3
verbose_ssl = yes
ssl_cert = </etc/postfix/certs/cert.pem
ssl_key = </etc/postfix/certs/key.pem

ssl_cipher_list = ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:ECDHE-RSA-DES-CBC3-SHA:ECDHE-ECDSA-DES-CBC3-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA
ssl_prefer_server_ciphers = yes

disable_plaintext_auth = no

mail_location = maildir:/mnt/mail/%d/%u/

auth_default_realm = di-finsim.ru

auth_mechanisms = PLAIN LOGIN

service auth {
 unix_listener /var/spool/postfix/private/auth {
 user = postfix
 group = postfix
 mode = 0666
 }
unix_listener auth-master {
 user = vmail
 group = vmail
 mode = 0666
 }

unix_listener auth-userdb {
 user = vmail
 group = vmail
 mode = 0660
 }
}

service lmtp {
 unix_listener /var/spool/postfix/private/dovecot-lmtp {
 user = postfix
 group = postfix
 mode = 0600
 }

 inet_listener lmtp {
 address = 127.0.0.1
 port = 24
 }
}

userdb {
 args = /etc/dovecot/dovecot-mysql.conf
 driver = sql
 }

passdb {
 args = /etc/dovecot/dovecot-mysql.conf
 driver = sql
 }

auth_master_user_separator = *
 
plugin {
 auth_socket_path = /var/run/dovecot/auth-master

 acl = vfile
 acl_shared_dict = file:/mnt/mail/shared-folders/shared-mailboxes.db
 sieve_dir = ~/.sieve/
 mailbox_alias_old = Sent
 mailbox_alias_new = Sent Messages
 mailbox_alias_old2 = Sent
 mailbox_alias_new2 = Sent Items
}

protocol lda {
 mail_plugins = $mail_plugins sieve
 auth_socket_path = /var/run/dovecot/auth-master
 deliver_log_format = mail from %f: msgid=%m %$
 log_path = /var/log/dovecot/lda-errors.log
 info_log_path = /var/log/dovecot/lda-deliver.log
 lda_mailbox_autocreate = yes
 lda_mailbox_autosubscribe = yes
# postmaster_address = root
}

protocol lmtp {
 info_log_path = /var/log/dovecot/lmtp.log
 mail_plugins = quota sieve
 postmaster_address = postmaster
 lmtp_save_to_detail_mailbox = yes
 recipient_delimiter = +
}

protocol imap {
 mail_plugins = $mail_plugins imap_acl
 imap_client_workarounds = tb-extra-mailbox-sep
 mail_max_userip_connections = 30
}

protocol pop3 {
 mail_plugins = $mail_plugins
 pop3_client_workarounds = outlook-no-nuls oe-ns-eoh
 pop3_uidl_format = %08Xu%08Xv
 mail_max_userip_connections = 30
}

service imap-login {
 service_count = 1
 process_limit = 500
 }

service pop3-login {
 service_count = 1
 }

service managesieve-login {
 inet_listener sieve {
 port = 4190
 }
}

service stats {
    unix_listener stats-reader {
        user = vmail
        group = vmail
        mode = 0660
    }

    unix_listener stats-writer {
        user = vmail
        group = vmail
        mode = 0660
    }
}

namespace {
 type = private
 separator = /
 prefix =
 inbox = yes

 mailbox Sent {
 auto = subscribe
 special_use = \Sent
 }
 mailbox "Sent Messages" {
 auto = no
 special_use = \Sent
 }
 mailbox "Sent Items" {
 auto = no
 special_use = \Sent
 }
 mailbox Drafts {
 auto = subscribe
 special_use = \Drafts
 }
 mailbox Trash {
 auto = subscribe
 special_use = \Trash
 }
 mailbox "Deleted Messages" {
 auto = no
 special_use = \Trash
 }
 mailbox Junk {
 auto = subscribe
 special_use = \Junk
 }
 mailbox Spam {
 auto = no
 special_use = \Junk
 }
 mailbox "Junk E-mail" {
 auto = no
 special_use = \Junk
 }
 mailbox Archive {
 auto = no
 special_use = \Archive
 }
 mailbox Archives {
 auto = no
 special_use = \Archive
 }
}

namespace {
 type = shared
 separator = /
 prefix = Shared/%%u/
 location = maildir:%%h:INDEX=%h/shared/%%u
 subscriptions = yes
 list = children
}
```

```bash
mkdir /mnt/mail
groupadd -g 1100 vmail
useradd -d /mnt/mail/ -g 1100 -u 1100 vmail
usermod -a -G dovecot vmail
chown vmail:vmail /mnt/mail
nano /etc/dovecot/dovecot-mysql.conf
```


/etc/dovecot/dovecot-mysql.conf (не забываем про пароль БД postfix... если в пароле есть спецсимволы вроде #, тогда значение connect обязательно должно быть в кавычках, как здесь):
```
driver = mysql
default_pass_scheme = CRYPT
connect = "host=127.0.0.1 dbname=postfix user=postfix password=________ПАРОЛЬ______________"
user_query = SELECT '/mnt/mail/%d/%u' as home, 'maildir:/mnt/mail/%d/%u' as mail, 1100 AS uid, 1100 AS gid, concat('*:bytes=', quota) AS quota_rule FROM mailbox WHERE username = '%u' AND active = '1'
password_query = SELECT username as user, password, '/mnt/mail/%d/%u' as userdb_home, 'maildir:/mnt/mail/%d/%u' as userdb_mail, 1100 as userdb_uid, 1100 as userdb_gid, concat('*:bytes=', quota) AS userdb_quota_rule FROM mailbox WHERE username = '%u' AND active = '1'
```

Далее:
```bash
mkdir /var/log/dovecot
cd /var/log/dovecot && touch main.log info.log debug.log lda-errors.log lda-deliver.log lmtp.log
chown -R vmail:dovecot /var/log/dovecot
mkdir /mnt/mail/shared-folders
chown -R vmail:vmail /mnt/mail
```

Ротация логов:
```bash
nano /etc/logrotate.d/dovecot
```
/etc/logrotate.d/dovecot:
```
/var/log/dovecot/*.log {
    weekly
    rotate 3
    compress
    missingok
    notifempty
    postrotate
	doveadm log reopen
    endscript
    create 0644 vmail dovecot
}
```

## DKIM
```bash
newaliases
apt install libsasl2-modules
apt install libsasl2-dev

apt install opendkim opendkim-tools
mkdir -p /etc/postfix/dkim && cd /etc/postfix/dkim
opendkim-genkey -D /etc/postfix/dkim/ -d di-finsim.ru -s mail
mv mail.private mail.di-finsim.ru.private
mv mail.txt mail.di-finsim.ru.txt
echo "mail._domainkey.di-finsim.ru di-finsim.ru:mail:/etc/postfix/dkim/mail.di-finsim.ru.private" > keytable
echo "*@di-finsim.ru mail._domainkey.di-finsim.ru" > signingtable
chown root:opendkim *
chmod u=rw,g=r,o= *
cp /etc/opendkim.conf /etc/opendkim.conf.orig
nano /etc/opendkim.conf
```

Содержимое /etc/opendkim.conf
```
AutoRestart yes
AutoRestartRate 10/1h
Umask 022
Syslog yes
SyslogSuccess yes
LogWhy yes
Mode sv
UserID opendkim:opendkim
Socket inet:8891@localhost
PidFile /var/run/opendkim/opendkim.pid
Canonicalization relaxed/relaxed
Selector default
MinimumKeyBits 1024
KeyFile /etc/postfix/dkim/mail.di-finsim.ru.private
KeyTable /etc/postfix/dkim/keytable
SigningTable refile:/etc/postfix/dkim/signingtable
```

```bash
systemctl restart postfix
systemctl start dovecot
systemctl enable postfix
systemctl enable dovecot
systemctl restart opendkim.service
systemctl enable opendkim.service
```


## reg.ru
В личном кабинете reg.ru необходимо добавить DNS записи:

```
A-запись
Subdomain: mail
IP address: 217.28.220.172

MX-запись
Subdomain: @
Priority: 10
Mail Server: mail.di-finsim.ru.

(да, там точка в конце)

TXT-запись
Subdomain: mail._domainkey
Text: <взять значение из /etc/postfix/dkim/mail.di-finsim.ru.txt без лишних пробелов и кавычек вот так: v=DKIM1; h=sha256; k=rsa; p=значение_p_оно_может_быть_на_двух_строках___нужно___объединить___удалив____кавычки___и__переносы_на_новую_строку>

TXT-запись
Subdomain: @
Text: v=spf1 ip4:217.28.220.172 ~all


TXT-запись
Subdomain: _dmarc 
Text: v=DMARC1; p=none; rua=mailto:dmarc@di-finsim.ru
```



# Wordpress, плагины, настройки
Поменять права директории wp-content:
```bash
chown -R www-data:www-data /var/www/wordpress/wp-content 
```

Добавить в исходник /var/www/wordpress/wp-config.php следующую строку:
```
define('FS_METHOD', 'direct');
```
Теперь можно устанавливать темы и плагины.

Логинимся как администратор сайта: http://di-finsim.ru/wp-admin

Необходимо из UI админки установить следующие компоненты:

Форум Asgaros Forum (установить, активировать, настройка описана дальше в этой инструкции):
http://di-finsim.ru/wp-admin/plugin-install.php?s=Asgaros&tab=search&type=term

Почтовый плагин POST SMTP Mailer (установить, активировать, настройка описана дальше в этой инструкции):
http://di-finsim.ru/wp-admin/plugin-install.php?s=Post%2520SMTP&tab=search&type=term

Тема IZ Viola (установить и активировать):
http://di-finsim.ru/wp-admin/theme-install.php?search=IZ%20Viola

## Настройка плагина Post SMTP

Далее перейти в мастер настройки

Выбрать Other SMTP
```
From Email: admin@di-finsim.ru
From Name: Администратор
Host Name: mail.di-finsim.ru
Port: 587
Username: admin@di-finsim.ru (или admin)
Password: пароль от почты (см. secrets, раздел E-mail: admin@di-finsim.ru password)
```

Чтобы открыть возможность регистрироваться на форуме, необходимо
в общих настройках поставить галку "Любой может зарегистрироваться": http://di-finsim.ru/wp-admin/options-general.php

## Настройка форума

Форум -> Структура -> Добавить
http://di-finsim.ru/wp-admin/admin.php?page=asgarosforum-structure#

## Ещё про wordpress:
Вид постоянных ссылок выбран "Название записи"
http://di-finsim.ru/wp-admin/options-permalink.php

Можно выбрать любой вид, кроме "Простой" (http://di-finsim.ru/?p=123). В случае такого вида придётся изобрести что-то, чтобы сделать постоянную ссылку на форум.
