import { createFileRoute, Link, redirect } from "@tanstack/react-router";

// TODO: Import useUserStore from your store definition file

export const Route = createFileRoute("/")({
  // beforeLoad: () => {
  //   if (
  //     typeof useUserStore !== "undefined" &&
  //     useUserStore.getState().isAuthenticated()
  //   ) {
  //     throw redirect({
  //       to: "/home",
  //     });
  //   }
  // },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Messenger App</h1>
    </div>
  );
}
