import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="border-b">
      <div className="wrapper flex-between">
        {/* Left */}
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        {/* Right */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
