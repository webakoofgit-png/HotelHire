import { forwardRef, useCallback, type ComponentProps } from "react";
import {
  Link as RouterLink,
  useNavigate as useRouterNavigate,
  useLocation,
  useSearchParams,
} from "react-router";
export { useLocation, useParams, useSearchParams } from "react-router";

export type Destination = {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, string | number | boolean | undefined>;
};
/** Compose app URLs while keeping dynamic values and query parameters encoded. */
export function destinationUrl({ to, params = {}, search }: Destination) {
  const path = to.replace(/\$([A-Za-z][A-Za-z0-9_]*)/g, (_, name: string) => {
    const value = params[name];
    if (value === undefined) throw new Error(`Missing URL parameter: ${name}`);
    return encodeURIComponent(value);
  });
  if (!search) return path;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const text = query.toString();
  return text ? `${path}?${text}` : path;
}
type LinkProps = Omit<ComponentProps<typeof RouterLink>, "to"> & Destination;
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, search, ...props },
  ref,
) {
  const location = useLocation();
  const href = destinationUrl({ to, ...(params ? { params } : {}), ...(search ? { search } : {}) });
  return (
    <RouterLink
      ref={ref}
      to={href}
      aria-current={location.pathname === href.split("?")[0] ? "page" : undefined}
      {...props}
    />
  );
});
export function useNavigate() {
  const navigate = useRouterNavigate();
  return useCallback(
    (target: Destination | string | number) => {
      if (typeof target === "number") return navigate(target);
      return navigate(typeof target === "string" ? target : destinationUrl(target));
    },
    [navigate],
  );
}
export function useJobSearch() {
  const [params] = useSearchParams();
  return {
    q: params.get("q") ?? "",
    city: params.get("city") ?? "",
    department: params.get("department") ?? "",
    experience: params.get("experience") ?? "",
  };
}
