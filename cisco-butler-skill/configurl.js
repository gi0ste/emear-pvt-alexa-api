// --[ SECTION 1 PARAMETERS USED FOR CONNECTIONS ] -------------------------------------------------------------------------------
const CCS_HOST_URL              = 'na.cloudcenter.cisco.com'
const CCS_CLOUD_PATH            = '/cloudcenter-cloud-setup/api/v1/tenants/1/clouds'
const CCS_DEPLOY_PATH           = '/cloudcenter-ccm-backend/api/v2/jobs'
const CCS_COST_PATH             = '/cloudcenter-shared-api/api/v1/costByProvider?cloudGroupId'
const CCS_TENANT_PATH           = '/suite-idm/api/v1/tenants'
const CCS_USERNAME              = '655872'
const CCS_USERNAME_APY_KEY      = '78099664-91af-4a15-a2ee-6382e3f98503'

const CWOM_HOST_URL             = 'cloudos.cisco.com/vmturbo/rest'
const CWOM_ACTIONS_LIST_URL     = '/markets/_0x3OYUglEd-gHc4L513yOA/actions/stats'
const CWOM_FULL_ACTIONS_LIST    = '/markets/_0x3OYUglEd-gHc4L513yOA/actions?limit=50&order_by=severity&ascending=true'
const CWOM_ACTION_STATS         = '/markets/_0x3OYUglEd-gHc4L513yOA/actions/stats'
const CWOM_USERNAME             = 'apiobserver'
const CWOM_USERNAME_APY_KEY     = 'observer'

module.exports = {
  CCS_HOST_URL,
  CCS_CLOUD_PATH,
  CCS_DEPLOY_PATH,
  CCS_COST_PATH,
  CCS_TENANT_PATH,
  CCS_USERNAME,
  CCS_USERNAME_APY_KEY,
  CWOM_HOST_URL,
  CWOM_ACTIONS_LIST_URL,
  CWOM_FULL_ACTIONS_LIST,
  CWOM_ACTION_STATS,
  CWOM_USERNAME,
  CWOM_USERNAME_APY_KEY,
};