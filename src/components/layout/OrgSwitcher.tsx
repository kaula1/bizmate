import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function OrgSwitcher() {
  const { profile, profiles, switchOrg } = useAuth();
  const [open, setOpen] = useState(false);

  if (!profile || profiles.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
          <Building2 className="w-4 h-4 text-primary" />
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium truncate">
            {profile?.organization?.name || 'No Organization'}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {profile?.role}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-2 h-auto"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg flex-shrink-0">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium truncate">
                {profile.organization?.name}
              </p>
              <Badge variant="outline" className="text-xs">
                {profile.role}
              </Badge>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              {profiles.map((userProfile) => (
                <CommandItem
                  key={userProfile.id}
                  value={userProfile.organization?.name}
                  onSelect={() => {
                    switchOrg(userProfile.org_id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      profile.org_id === userProfile.org_id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {userProfile.organization?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {userProfile.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {userProfile.organization?.currency}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}