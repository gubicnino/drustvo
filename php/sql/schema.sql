-- Planinsko društvo Goričko – Tromeja
-- MySQL / MariaDB shema + začetni podatki (migrirano iz content/*.json)
--
-- Uvoz prek phpMyAdmin (cPanel) ali ukazne vrstice:
--   mysql -u UPORABNIK -p IME_BAZE < schema.sql
--
-- Privzeti administrator:  uporabniško ime "urejevalec"  /  geslo "admin123"
-- !!! Po prvi prijavi OBVEZNO zamenjaj geslo (scripts/create-user.php). !!!

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ---------------------------------------------------------------------------
-- Tabele
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS hikes;
CREATE TABLE hikes (
  id          CHAR(36)     NOT NULL,
  slug        VARCHAR(160) NOT NULL,
  title       VARCHAR(160) NOT NULL,
  date        DATE         NOT NULL,
  location    VARCHAR(200) NOT NULL,
  difficulty  ENUM('easy','medium','hard') NOT NULL DEFAULT 'easy',
  distance    VARCHAR(40)  NOT NULL DEFAULT '',
  elevation   VARCHAR(40)  NOT NULL DEFAULT '',
  description  TEXT        NOT NULL,
  image       VARCHAR(255) NOT NULL DEFAULT '',
  images      TEXT         NULL,           -- JSON polje poti do slik
  published   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL,
  updated_at  DATETIME     NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_slug (slug),
  KEY idx_published_date (published, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id            CHAR(36)     NOT NULL,
  username      VARCHAR(60)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'admin',
  PRIMARY KEY (id),
  UNIQUE KEY uniq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS society;
CREATE TABLE society (
  id             TINYINT      NOT NULL DEFAULT 1,
  name           VARCHAR(160) NOT NULL,
  short_name     VARCHAR(120) NOT NULL DEFAULT '',
  tagline        VARCHAR(255) NOT NULL DEFAULT '',
  about          TEXT         NOT NULL,
  mission        TEXT         NOT NULL,
  founded        VARCHAR(20)  NOT NULL DEFAULT '',
  member_count   VARCHAR(20)  NOT NULL DEFAULT '',
  hikes_per_year VARCHAR(20)  NOT NULL DEFAULT '',
  email          VARCHAR(160) NOT NULL DEFAULT '',
  phone          VARCHAR(60)  NOT NULL DEFAULT '',
  address        VARCHAR(255) NOT NULL DEFAULT '',
  facebook       VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  CONSTRAINT chk_single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Začetni podatki
-- ---------------------------------------------------------------------------

INSERT INTO society
  (id, name, short_name, tagline, about, mission, founded, member_count,
   hikes_per_year, email, phone, address, facebook)
VALUES
  (1,
   'Planinsko društvo Goričko – Tromeja',
   'PD Goričko – Tromeja',
   'Skupaj odkrivamo lepote gora in narave.',
   'Planinsko društvo Goričko – Tromeja združuje ljubitelje gora in narave iz Prekmurja in okolice. Organiziramo vodene pohode, izlete in družabne dogodke za vse generacije – od lahkih sprehodov po gričevnatem Goričkem do zahtevnejših vzponov v slovenske in sosednje gore. Pri nas štejejo dobra družba, varnost in spoštljiv odnos do narave.',
   'Naše poslanstvo je povezovati ljudi z naravo, spodbujati zdrav in aktiven življenjski slog ter ohranjati planinsko tradicijo na tromeji med Slovenijo, Avstrijo in Madžarsko.',
   '2000', '100+', '30+',
   'pdgoricko-tromeja@gmail.com',
   '+386 2 555 12 34',
   'Gornji Slaveči 100, 9263 Kuzma, Slovenia',
   'https://www.facebook.com/profile.php?id=100068092102411');

-- Geslo: admin123  (bcrypt, $2y$). Zamenjaj po prvi prijavi.
INSERT INTO users (id, username, password_hash, role) VALUES
  ('b221662b-b1b2-408a-9d5a-dafb47f5d138', 'urejevalec',
   '$2y$12$XyabG46KbaSrXek.NrFy3.9sUt92Ct/HH0uSls60V5FPFGskp3cs.', 'admin');

INSERT INTO hikes
  (id, slug, title, date, location, difficulty, distance, elevation,
   description, image, images, published, created_at, updated_at)
VALUES
  ('0b3c1a90-1111-4a01-9a01-000000000004',
   'ppp-lenart-trije-kralji',
   'Pomurska planinska pot: Lenart – Trije Kralji',
   '2026-05-16',
   'Lenart – Sveta Trojica – Trije Kralji, Slovenske gorice',
   'hard', '21 km', '500 m',
   'Izkoristili smo prekrasno vreme in nadaljevali Pomursko planinsko pot od Lenarta naprej – čez Zavrh in Sveto Trojico vse do Treh Kraljev v Slovenskih goricah. Zbrala se je lepa skupina desetih pohodnikov, ki je brez težav premagala dobrih 21 kilometrov poti po valovitem gričevju, vinogradih in gozdnih stezah. Tudi najmlajši pohodnik, star komaj sedem let, je pokazal, kaj zmore. Čestitke vsem udeležencem – jeseni nadaljujemo naprej!',
   '/uploads/ppp-1.jpg',
   '["\/uploads\/ppp-1.jpg","\/uploads\/ppp-2.jpg","\/uploads\/ppp-3.jpg"]',
   1, '2026-05-17 09:00:00', '2026-05-17 09:00:00'),

  ('0b3c1a90-1111-4a01-9a01-000000000003',
   'lepenatka-rogatec-menina',
   'Rogatec in Lepenatka na Menini planini',
   '2026-04-06',
   'Menina planina, Kamniško-Savinjske Alpe',
   'medium', '14 km', '700 m',
   'Velikonočni ponedeljek smo planinci PD Goričko Tromeja izkoristili za potep po prekrasnem sredogorju Menine planine. Pot nas je vodila čez razgledno Lepenatko (1426 m) do vrha Rogatec, najvišje točke Menine. Prijetno družbo je grelo spomladansko sonce, ob širnih razgledih na Kamniško-Savinjske Alpe in Savinjsko dolino pa je dan minil veliko prehitro.',
   '/uploads/lepenatka-1.jpg',
   '["\/uploads\/lepenatka-1.jpg","\/uploads\/lepenatka-2.jpg","\/uploads\/lepenatka-3.jpg","\/uploads\/lepenatka-4.jpg"]',
   1, '2026-04-07 09:00:00', '2026-04-07 09:00:00'),

  ('0b3c1a90-1111-4a01-9a01-000000000002',
   'pohod-na-goro-oljko',
   'Pohod na goro Oljko',
   '2026-03-21',
   'Gora Oljka, Polzela',
   'easy', '8 km', '400 m',
   'Planinci PD Goričko Tromeja smo se podali na goro Oljko (733 m) nad Polzelo. Zbrala se je zelo pisana druščina – vse od sedemletnika do petinsedemdesetletnika – kar najlepše priča, da so naši pohodi namenjeni prav vsem generacijam. Ob prijetni družbi in toplem soncu smo se povzpeli mimo znamenite cerkve sv. Krištofa do vrha ter uživali v razgledu na Savinjsko dolino. Čudovito preživet dan v naravi.',
   '/uploads/oljka-1.jpg',
   '["\/uploads\/oljka-1.jpg","\/uploads\/oljka-2.jpg","\/uploads\/oljka-3.jpg","\/uploads\/oljka-4.jpg","\/uploads\/oljka-5.jpg"]',
   1, '2026-03-22 09:00:00', '2026-03-22 09:00:00'),

  ('0b3c1a90-1111-4a01-9a01-000000000001',
   'pohod-na-donacko-goro',
   'Donačka gora – prvi pohod sezone',
   '2026-01-24',
   'Donačka gora, Haloze',
   'easy', '8 km', '500 m',
   'V soboto, 24. januarja, smo opravili prvi pohod v novem letu. Odpravili smo se na markantno Donačko goro (884 m), enega najlepših razglednikov ob meji med Halozami in Štajersko. Ujeli smo čudovito sončno vreme brez megle, le na nekaterih odsekih je bilo zaradi zmrznjene podlage treba stopati previdno. Pot je sicer nezahtevna, vzpon skozi gozd pa nas je nagradil z razgledom na Boč in obronke Haloz. Imeli smo se odlično – lep začetek nove planinske sezone.',
   '/uploads/donacka-1.jpg',
   '["\/uploads\/donacka-1.jpg","\/uploads\/donacka-2.jpg","\/uploads\/donacka-3.jpg"]',
   1, '2026-01-25 09:00:00', '2026-01-25 09:00:00'),

  ('0b3c1a90-1111-4a01-9a01-000000000005',
   'drustveno-srecanje-grmada',
   'Društveno srečanje na Grmadi',
   '2025-09-20',
   'Grmada nad Celjem',
   'easy', '9 km', '450 m',
   'Vsakoletnega društvenega srečanja PD Grmada Celje smo se z veseljem udeležili tudi člani PD Goričko Tromeja. Prijateljsko društvo nas je lepo sprejelo in pogostilo, za kar se jim iskreno zahvaljujemo. Preživeli smo lep sončen planinski dan ob pohodu na Grmado nad Celjem in prijetnem druženju. Pridružila sta se nam tudi dva nova mlada pohodnika, ki sta brez težav prehodila svojo prvo pravo planinsko turo – čeprav prihajata z ravninskega dela Prekmurja. Hvala vsem udeležencem za nepozabno druženje.',
   '/uploads/grmada-1.jpg',
   '["\/uploads\/grmada-1.jpg","\/uploads\/grmada-2.jpg","\/uploads\/grmada-3.jpg","\/uploads\/grmada-4.jpg","\/uploads\/grmada-5.jpg","\/uploads\/grmada-6.jpg"]',
   1, '2025-09-21 09:00:00', '2025-09-21 09:00:00');
