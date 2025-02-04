const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 wrapper">{children}</main>
    </div>
  );
};

export default MainLayout;
