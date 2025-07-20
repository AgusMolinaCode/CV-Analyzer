import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CandidateFilters } from "@/types/candidate";
import { X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUniqueStackTechnologies } from "@/lib/supabase-queries";

interface CandidateFiltersProps {
  filters: CandidateFilters;
  onFiltersChange: (filters: CandidateFilters) => void;
  onClearFilters: () => void;
}

const seniorityOptions = ['Junior', 'Semi-Senior', 'Senior', 'Lead'];
const statusOptions = ['pendiente', 'revisado', 'entrevista', 'rechazado', 'contratado'];

export function CandidateFilters({ filters, onFiltersChange, onClearFilters }: CandidateFiltersProps) {
  const { user } = useUser();
  const [allStackOptions, setAllStackOptions] = useState<string[]>(['React', 'Node.js', 'Java', 'Spring Boot', 'Python', 'Vue.js', 'Angular', 'TypeScript', 'CSS']);
  const [visibleStackCount, setVisibleStackCount] = useState(10);

  const visibleStackOptions = allStackOptions.slice(0, visibleStackCount);
  const hasMoreStacks = visibleStackCount < allStackOptions.length;

  useEffect(() => {
    const loadStackOptions = async () => {
      if (user?.id) {
        try {
          const uniqueStacks = await getUniqueStackTechnologies(user.id);
          if (uniqueStacks.length > 0) {
            setAllStackOptions(uniqueStacks);
            setVisibleStackCount(10);
          }
        } catch (error) {
          console.error('Error loading stack technologies:', error);
        }
      }
    };

    loadStackOptions();
  }, [user?.id]);

  const showMoreStacks = () => {
    setVisibleStackCount(prev => Math.min(prev + 10, allStackOptions.length));
  };
  const updateFilter = (key: keyof CandidateFilters, value: string[] | boolean | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'seniority' | 'mainStack' | 'processStatus', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const hasActiveFilters = 
    filters.seniority.length > 0 ||
    filters.mainStack.length > 0 ||
    filters.processStatus.length > 0 ||
    filters.remoteAvailable !== undefined ||
    filters.minMatchScore > 0 ||
    filters.maxMatchScore < 100;

  return (
    <Card className="h-fit bg-transparent border-none shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Seniority Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Seniority</Label>
          <div className="space-y-2">
            {seniorityOptions.map((seniority) => (
              <div key={seniority} className="flex items-center space-x-2">
                <Checkbox
                  id={seniority}
                  checked={filters.seniority.includes(seniority)}
                  onCheckedChange={() => toggleArrayFilter('seniority', seniority)}
                />
                <Label htmlFor={seniority} className="text-sm cursor-pointer">
                  {seniority}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Estado del proceso</Label>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={status}
                  checked={filters.processStatus.includes(status)}
                  onCheckedChange={() => toggleArrayFilter('processStatus', status)}
                />
                <Label htmlFor={status} className="text-sm cursor-pointer capitalize">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Stack Filter */}
        <div>
          <div className="flex items-center gap-2 mx-auto mb-3">
            <Label className="text-sm font-medium">Stack tecnológico</Label>
            {visibleStackCount > 10 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setVisibleStackCount(10)}
                className=" px-2 text-xs text-muted-foreground"
              >
                Reset
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {visibleStackOptions.map((tech) => (
              <div key={tech} className="flex items-center space-x-2">
                <Checkbox
                  id={tech}
                  checked={filters.mainStack.includes(tech)}
                  onCheckedChange={() => toggleArrayFilter('mainStack', tech)}
                />
                <Label htmlFor={tech} className="text-sm cursor-pointer">
                  {tech}
                </Label>
              </div>
            ))}
            {hasMoreStacks && (
              <Button
                variant="ghost"
                size="sm"
                onClick={showMoreStacks}
                className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Ver más ({allStackOptions.length - visibleStackCount} restantes)
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Remote Work Filter */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remote"
              checked={filters.remoteAvailable === true}
              onCheckedChange={(checked) => 
                updateFilter('remoteAvailable', checked ? true : undefined)
              }
            />
            <Label htmlFor="remote" className="text-sm cursor-pointer">
              Disponible para trabajo remoto
            </Label>
          </div>
        </div>

        {/* Match Score Filter */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Match Score: {filters.minMatchScore} - {filters.maxMatchScore}
          </Label>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Mínimo</Label>
              <Slider
                value={[filters.minMatchScore]}
                onValueChange={([value]) => updateFilter('minMatchScore', value)}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Máximo</Label>
              <Slider
                value={[filters.maxMatchScore]}
                onValueChange={([value]) => updateFilter('maxMatchScore', value)}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Filtros activos</Label>
            <div className="flex flex-wrap gap-1">
              {filters.seniority.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('seniority', item)}
                  />
                </Badge>
              ))}
              {filters.processStatus.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('processStatus', item)}
                  />
                </Badge>
              ))}
              {filters.mainStack.map((item) => (
                <Badge key={item} variant="secondary" className="text-xs">
                  {item}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => toggleArrayFilter('mainStack', item)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}