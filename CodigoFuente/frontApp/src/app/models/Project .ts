export class Project {
  id: number=0;
  project_name: string='';
  repo_url: string='';
  client: string='';
  developers: string='';
  ci: boolean=false;
  cd: boolean=false;
  frontend_tecnology: string='';
  backend_tecnology: string='';
  databases: string='';
  errors_count: number=0;
  warning_count: number=0;
  deploy_count: number=0;
  percentage_completion: number=0;
  report_nc: number=0;
  status: string='';
}
