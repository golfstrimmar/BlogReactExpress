declare module "*.svg" {
  import { ReactComponent as ReactSVG } from "react";
  export default ReactSVG;
}
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}
