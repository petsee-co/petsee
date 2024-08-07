export enum ProjectEvents {
  PROJECT_WILDCARD = 'project.*',
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  PROJECT_DELETED = 'project.deleted',
  API_KEY_WILDCARD = 'project.api_key.*',
  API_KEY_CREATED = 'project.api_key.created',
  API_KEY_UPDATED = 'project.api_key.updated',
  API_KEY_DELETED = 'project.api_key.deleted',
  WEBHOOK_WILDCARD = 'project.webhook.*',
  WEBHOOK_CREATED = 'project.webhook.created',
  WEBHOOK_UPDATED = 'project.webhook.updated',
  WEBHOOK_DELETED = 'project.webhook.deleted',
  WEBHOOK_LOG_WILDCARD = 'project.webhook.log.*',
  WEBHOOK_LOG_CREATED = 'project.webhook.log.created',
  WEBHOOK_LOG_UPDATED = 'project.webhook.log.updated',
  WEBHOOK_LOG_DELETED = 'project.webhook.log.deleted',
}
