import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { CandidateFilters } from "@/types/candidate";
import { X } from "lucide-react";

interface CandidateFiltersProps {
  filters: CandidateFilters;
  onFiltersChange: (filters: CandidateFilters) => void;
  onClearFilters: () => void;
}

const seniorityOptions = ['Junior', 'Semi-Senior', 'Senior', 'Lead'];
const statusOptions = ['pendiente', 'revisado', 'entrevista', 'rechazado', 'contratado'];
const stackOptions = ['React', 'Node.js', 'Java', 'Spring Boot', 'Python', 'Vue.js', 'Angular', 'TypeScript', 'CSS'];

export function CandidateFilters({ filters, onFiltersChange, onClearFilters }: CandidateFiltersProps) {
  const updateFilter = (key: keyof CandidateFilters, value: any) => {
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
    <Card className="h-fit">
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
          <Label className="text-sm font-medium mb-3 block">Stack tecnológico</Label>
          <div className="space-y-2">
            {stackOptions.map((tech) => (
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