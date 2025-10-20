import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ThemeModeSwticher from './theme-mode-switcher';
import HeaderLogo from './header-logo';

const GlobalHeader = () => {
  return (
    <header className="flex px-10 py-3 shadow-xl shadow-gray-300 dark:shadow-white dark:shadow-lg/50 justify-between">
      <HeaderLogo />
      <div className="flex items-center gap-4">
        <div className="grow-1">
          <Input type="text" placeholder="search..." />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center space-x-2">
          <ThemeModeSwticher />
        </div>
        <Avatar className="cursor-pointer size-10">
          <AvatarImage src="/assets/images/sample-pf.jpg" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default GlobalHeader;
