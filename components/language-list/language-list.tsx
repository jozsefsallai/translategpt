import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LANG_AUTO, Language } from "@/constants/languages";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export interface LanguageListProps {
  languages: Language[];
  latestLanguages: Language[];
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
  displayAuto?: boolean;
}

interface LanguagePillProps {
  language: Language;
  isSelected: boolean;
  onClick: (language: Language) => void;
  className?: string;
}

function LanguagePill({
  language,
  isSelected,
  onClick,
  className,
}: LanguagePillProps) {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      role="option"
      onClick={() => onClick(language)}
      className={className}
    >
      {language.name}
    </Button>
  );
}

export function LanguageList({
  languages,
  latestLanguages,
  selectedLanguage,
  onLanguageSelect,
  displayAuto,
}: LanguageListProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="flex flex-wrap gap-2">
      {displayAuto && (
        <LanguagePill
          className="hidden md:block"
          language={LANG_AUTO}
          isSelected={selectedLanguage.code === LANG_AUTO.code}
          onClick={() => onLanguageSelect(LANG_AUTO)}
        />
      )}

      {latestLanguages.map((lang) => (
        <LanguagePill
          key={lang.code}
          className="hidden md:block"
          language={lang}
          isSelected={selectedLanguage.code === lang.code}
          onClick={onLanguageSelect}
        />
      ))}

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className="w-full md:w-auto"
          >
            <span className="block md:hidden mr-2">
              {selectedLanguage.name || "Language"}
            </span>

            <ChevronsUpDown className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="max-w-[300px]">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandEmpty>No such language.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  value={LANG_AUTO.name}
                  onSelect={() => {
                    onLanguageSelect(LANG_AUTO);
                    setPopoverOpen(false);
                  }}
                  className="block md:hidden"
                >
                  {LANG_AUTO.name}
                </CommandItem>

                {languages.map((lang) => (
                  <CommandItem
                    key={lang.code}
                    value={lang.name}
                    onSelect={() => {
                      onLanguageSelect(lang);
                      setPopoverOpen(false);
                    }}
                  >
                    {lang.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
