# Car rental

#### Простой сайт по аренде автомобилей

___
## Функционал
##### 1) Авторизация арендатора, арендодателя
##### 2) CRUD с обьявлениями автомобилей(арендодатель)
##### 3) Поиск автомобилей по определенным параметрам(бренд, модель и тд)
##### 4) Сортировка обьявлений по возрастанию и убыванию цен, актуальности
##### 5) Список обьявлений, просмотренных ранее 
##### 6) Выбор конкретного обьявления, подсчет стоимости аренды по датам
##### 7) Наличие списка автомобилей находящихся в аренде

___

## Account (Аккаунт)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|username|VARCHAR(50)|not null; unique|Название аккаунта|
|password|VARCHAR(50)|not null|пароль|


## User (Пользователь)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|role_id|INT(4) (ForeignKey(Role))|not null|id роли|
|account_id|INT(4) (OneToOne(Account))|not null|Название аккаунта|
|email|VARCHAR(100)|not null; unique|почта|
|telephone|VARCHAR(13)|blank=True; unique|номер телефона|
|date_of_birth|DATE|not null|дата рождения|
|rent_status|BOOLEAN|not null; default(False)|статус аренды|


## Landlord (Арендодатель)
___
имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|user_id|INT(4) (OneToOne(User))|not null|id арендодателя|
|special_key|VARCHAR(10)|not null, unique|спец. ключ арендодателя|


## Role (роль пользователя)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|name|VARCHAR(50)|not null|название роли|
|permission|VARCHAR(50)|not null|права роли|


## Brand (Бренд)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:---------:|:------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|name|VARCHAR(50)|not null|марка|
|model|VARCHAR(50)|not null|модель|


## Car_type (Тип транспорта)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:---------:|:------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|type_name|VARCHAR(50)|not null, unique|название типа транспорта|


## Car (Автомобиль)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:---------:|:------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|landlord_id|INT(4) (ForeignKey(Landlord))|not null|id арендодателя|
|car_type_id|INT(4) (ForeignKey(Car_type))|not null|id типа транспорта|
|brand_id|INT(4) (ForeignKey(Brand))|not null|id марки/модели|
|fuel_type|VARCHAR(20)|blank=True|тип топлива|
|seats_count|INT(4)|blank=True|кол-во посадочных мест|
|color|VARCHAR(50)|blank=True|цвет кузова|
|registration_plate|VARCHAR(10)|not null; unique|гос. регистрационный номер|
|price_per_hour|INT(16)|not null|цена за час аренды|


## Car_images (Фотографии автомобилей)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:---------:|:------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|car_id|INT(4) (OneToOne(Car))|not null|автомобиль|
|url|VARCHAR(200)|not null, unique|путь к фотографиям|


## Rental_deal (Арендная сделка)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|user_id|INT(4) (ForeignKey(User))|not null|id пользователя|
|car_id|INT(4) (OneToOne(Car))|not null; unique|арендованный автомобиль|
|pick_up_id|INT(4) (ForeignKey(Pick_up_point))|not null|id пункта приема-выдачи|
|start_date|DATE|not null|дата начала аренды|
|end_date|DATE|not null|дата конца аренды|
|total_price|INT(16)|not null|цена за аренду|


## Pick_up_point (Пункт приема-выдачи)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|reception_point|VARCHAR(100)|not null|пункт приема|
|issue_point|VARCHAR(100)|blank=True|пункт выдачи|


## User_logs (Логи)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|user_id|INT(4) (ForeignKey(User))|not null|id пользователя|
|message|VARCHAR(500)|not null|логи событий|


## Tax_filling (Налоговая декларация)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|tax_id|INT(4) (ForeignKey(Tax))|not null|id налога|
|rental_deal_id|INT(4) (ForeignKey(Rental_deal))|not null|id арендной сделки|


## Tax (Налог)
___
|имя поля|тип|ограничения|описание|
|:------:|:-:|:----------:|:-------:|
|id|INT(4) (pk; auto increment)|not null; unique|первичный ключ|
|tax_name|VARCHAR(50)|not null; unique|Название налога|
|percent|VARCHAR(10)|not null|процент налога от стоимости аренды|
|price|INT(16)|not null|стоимость налога|
___
## Макет
https://www.figma.com/file/cPtv2HarTTkfVx720rnY7S/car_rental?node-id=0%3A1&t=TRKDVOU6RT7TgaBf-0