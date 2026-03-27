export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clientes/:path*",
    "/contratos/:path*",
    "/projetos/:path*",
    "/tarefas/:path*"
  ]
};
