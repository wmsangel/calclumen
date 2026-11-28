/**
 * One Amazon Associates link. No URL in HTML: href="#" + data-go="<item slug>";
 * the tokenized /go URL is built on a trusted click by <ClickTracker/>, and the
 * route adds the tag and the per-page ascsubtag (calclumen-<page>) server-side.
 * Link is rel="sponsored nofollow noopener".
 */
export function AmazonLink({
  item,
  tool,
  children,
  className,
}: {
  /** short stable item slug (also the /go id) */
  item: string;
  /** page slug → sub-id */
  tool: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="#"
      data-go={item}
      data-go-s={tool}
      data-aff-item={item}
      data-aff-network="amazon"
      data-aff-placement="materials"
      target="_blank"
      rel="sponsored nofollow noopener"
      className={className}
    >
      {children}
    </a>
  );
}
