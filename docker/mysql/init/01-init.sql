-- Databases auxiliares
CREATE DATABASE IF NOT EXISTS pilates_test;

-- Grants (dev/test)
GRANT ALL PRIVILEGES ON pilates_dev.* TO 'pilates'@'%';
GRANT ALL PRIVILEGES ON pilates_test.* TO 'pilates'@'%';
FLUSH PRIVILEGES;


