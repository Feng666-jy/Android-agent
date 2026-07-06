-- 新建三张 AI 模型表
-- 执行前请确保已运行: npx prisma generate

CREATE TABLE IF NOT EXISTS `deepseek_models` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_name` VARCHAR(191) NOT NULL,
  `display_name` VARCHAR(191) NOT NULL,
  `api_provider` VARCHAR(191) NOT NULL DEFAULT 'DeepSeek',
  `status` INT NOT NULL DEFAULT 1,
  `sort` INT NOT NULL DEFAULT 0,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `claude_models` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_name` VARCHAR(191) NOT NULL,
  `display_name` VARCHAR(191) NOT NULL,
  `api_provider` VARCHAR(191) NOT NULL DEFAULT 'Claude',
  `status` INT NOT NULL DEFAULT 1,
  `sort` INT NOT NULL DEFAULT 0,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chatgpt_models` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_name` VARCHAR(191) NOT NULL,
  `display_name` VARCHAR(191) NOT NULL,
  `api_provider` VARCHAR(191) NOT NULL DEFAULT 'ChatGPT',
  `status` INT NOT NULL DEFAULT 1,
  `sort` INT NOT NULL DEFAULT 0,
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- DeepSeek 演示数据
INSERT INTO `deepseek_models` (`id`, `model_name`, `display_name`, `api_provider`, `status`, `sort`) VALUES
(1, 'deepseek-chat', 'DeepSeek V3', 'DeepSeek', 1, 1),
(2, 'deepseek-reasoner', 'DeepSeek R1', 'DeepSeek', 1, 2),
(3, 'deepseek-coder', 'DeepSeek Coder', 'DeepSeek', 1, 3),
(4, 'deepseek-v2.5', 'DeepSeek V2.5', 'DeepSeek', 1, 4),
(5, 'deepseek-v2', 'DeepSeek V2', 'DeepSeek', 0, 5);