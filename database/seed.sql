-- AntiGravity Model Management System Seed Data
-- DBMS: MySQL 8.0+ / MariaDB 10.5+

USE `antigravity_db`;

-- Seed Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'Super administrator with full system permissions and management capabilities'),
(2, 'MANAGER', 'Content and model manager with creation, editing, and publishing permissions'),
(3, 'USER', 'Standard system user with model browsing, testing, and downloading permissions')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Permissions
INSERT INTO `permissions` (`id`, `name`, `description`) VALUES
(1, 'models:create', 'Permission to create new models'),
(2, 'models:read', 'Permission to view models'),
(3, 'models:update', 'Permission to edit models'),
(4, 'models:delete', 'Permission to delete models'),
(5, 'users:read', 'Permission to view user list'),
(6, 'users:manage', 'Permission to manage user accounts and roles'),
(7, 'settings:manage', 'Permission to update system configuration'),
(8, 'analytics:read', 'Permission to view system analytics')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Role Permissions (Admin gets all, Manager gets model/analytics, User gets read)
INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(2, 1), (2, 2), (2, 3), (2, 8),
(3, 2)
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

-- Seed Initial Users (Passwords pre-hashed using bcrypt - default password: "Password123!")
-- Hash: $2b$10$wO3mYc.sN3T3t/uM9A7v7O.8tC8G3x2h2KzE6N8lQ.kG5P8M2g2S
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `avatar`, `role_id`, `is_verified`, `status`) VALUES
('usr-admin-00000000-0000-000000000001', 'admin@antigravity.ai', '$2b$10$wO3mYc.sN3T3t/uM9A7v7O.8tC8G3x2h2KzE6N8lQ.kG5P8M2g2S', 'System', 'Admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 1, TRUE, 'ACTIVE'),
('usr-mngr-00000000-0000-000000000002', 'manager@antigravity.ai', '$2b$10$wO3mYc.sN3T3t/uM9A7v7O.8tC8G3x2h2KzE6N8lQ.kG5P8M2g2S', 'Alex', 'Vance', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 2, TRUE, 'ACTIVE'),
('usr-user-00000000-0000-000000000003', 'user@antigravity.ai', '$2b$10$wO3mYc.sN3T3t/uM9A7v7O.8tC8G3x2h2KzE6N8lQ.kG5P8M2g2S', 'Sarah', 'Connor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 3, TRUE, 'ACTIVE')
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- Seed Categories
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`) VALUES
(1, 'Computer Vision', 'computer-vision', 'Visual recognition, object detection, segmentation, and generative image models', 'eye'),
(2, 'Natural Language Processing', 'natural-language-processing', 'LLMs, sentiment analysis, text classification, and translation models', 'message-square'),
(3, 'Reinforcement Learning', 'reinforcement-learning', 'Agent policies, gaming bots, decision trees, and robotic control systems', 'cpu'),
(4, 'Audio & Speech Processing', 'audio-speech-processing', 'Speech-to-text, TTS synthesis, voice cloning, and audio enhancement models', 'mic'),
(5, 'Multimodal Intelligence', 'multimodal-intelligence', 'Cross-modal vision-language-audio reasoning models', 'layers')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Tags
INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
(1, 'PyTorch', 'pytorch'),
(2, 'TensorFlow', 'tensorflow'),
(3, 'Transformer', 'transformer'),
(4, 'Diffusion', 'diffusion'),
(5, 'Edge-AI', 'edge-ai'),
(6, 'FP16', 'fp16'),
(7, 'INT8 Quantized', 'int8-quantized')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Seed Models
INSERT INTO `models` (`id`, `title`, `slug`, `description`, `version`, `framework`, `parameters_count`, `accuracy_score`, `status`, `category_id`, `created_by_id`, `downloads_count`, `views_count`) VALUES
('mdl-0000-0000-0000-000000000001', 'AntiGravity-Vision-v4', 'antigravity-vision-v4', 'High-speed object detection and segmentation transformer tuned for real-time edge processing.', '4.2.0', 'PyTorch 2.3', 850000000, 94.85, 'ACTIVE', 1, 'usr-admin-00000000-0000-000000000001', 1420, 5890),
('mdl-0000-0000-0000-000000000002', 'Orbit-LLM-7B-Instruct', 'orbit-llm-7b-instruct', '7 Billion parameter instruction-tuned causal language model optimized for coding and logical reasoning.', '1.0.5', 'PyTorch / HuggingFace', 7000000000, 91.20, 'ACTIVE', 2, 'usr-mngr-00000000-0000-000000000002', 3890, 12450),
('mdl-0000-0000-0000-000000000003', 'AeroDiffusion-Pro', 'aerodiffusion-pro', 'Latent image synthesis model capable of photorealistic rendering from complex multi-line prompts.', '2.1.0', 'TensorFlow 2.15', 3200000000, 88.50, 'ACTIVE', 1, 'usr-admin-00000000-0000-000000000001', 980, 4110)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- Seed Model Tags
INSERT INTO `model_tags` (`model_id`, `tag_id`) VALUES
('mdl-0000-0000-0000-000000000001', 1),
('mdl-0000-0000-0000-000000000001', 5),
('mdl-0000-0000-0000-000000000001', 6),
('mdl-0000-0000-0000-000000000002', 1),
('mdl-0000-0000-0000-000000000002', 3),
('mdl-0000-0000-0000-000000000002', 7),
('mdl-0000-0000-0000-000000000003', 2),
('mdl-0000-0000-0000-000000000003', 4)
ON DUPLICATE KEY UPDATE `model_id` = VALUES(`model_id`);

-- Seed Model Images
INSERT INTO `model_images` (`model_id`, `url`, `is_primary`) VALUES
('mdl-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', TRUE),
('mdl-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800', TRUE),
('mdl-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800', TRUE);

-- Seed System Settings
INSERT INTO `settings` (`key`, `value`, `description`) VALUES
('site_name', 'AntiGravity Model Hub', 'Application branding name'),
('max_upload_size_mb', '100', 'Maximum allowed image upload size in megabytes'),
('enable_registration', 'true', 'Flag to enable/disable self user registration'),
('jwt_expiration_hours', '24', 'Access token lifetime in hours')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
