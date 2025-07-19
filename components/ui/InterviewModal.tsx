import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Candidate } from "@/types/candidate";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface InterviewModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (interviewData: any) => void;
}

export function InterviewModal({ candidate, isOpen, onClose, onSchedule }: InterviewModalProps) {
  const [formData, setFormData] = useState({
    date: null as Date | null,
    time: "",
    type: "",
    mode: "",
    duration: "60",
    interviewerName: "",
    meetingUrl: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.type || !formData.mode) {
      return;
    }

    const [hours, minutes] = formData.time.split(':');
    const scheduledDate = new Date(formData.date);
    scheduledDate.setHours(parseInt(hours), parseInt(minutes));

    const interviewData = {
      candidateId: candidate?.id,
      type: formData.type,
      scheduledDate: scheduledDate.toISOString(),
      duration: parseInt(formData.duration),
      mode: formData.mode,
      meetingUrl: formData.meetingUrl,
      interviewerName: formData.interviewerName,
      notes: formData.notes,
      status: 'programada'
    };

    onSchedule(interviewData);
    onClose();
    
    // Reset form
    setFormData({
      date: null,
      time: "",
      type: "",
      mode: "",
      duration: "60",
      interviewerName: "",
      meetingUrl: "",
      notes: ""
    });
  };

  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Entrevista - {candidate.fullName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, date: date as Date | null }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Hora</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Interview Type */}
            <div className="space-y-2">
              <Label>Tipo de Entrevista</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="hr">Recursos Humanos</SelectItem>
                  <SelectItem value="tecnica">Técnica</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interview Mode */}
            <div className="space-y-2">
              <Label>Modalidad</Label>
              <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modalidad" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duración (minutos)</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1.5 horas</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Interviewer */}
            <div className="space-y-2">
              <Label>Entrevistador</Label>
              <Input
                value={formData.interviewerName}
                onChange={(e) => setFormData(prev => ({ ...prev, interviewerName: e.target.value }))}
                placeholder="Nombre del entrevistador"
                required
              />
            </div>
          </div>

          {/* Meeting URL */}
          {formData.mode === 'online' && (
            <div className="space-y-2">
              <Label>Link de Videollamada</Label>
              <Input
                value={formData.meetingUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, meetingUrl: e.target.value }))}
                placeholder="https://meet.google.com/xxx-xxx-xxx"
                type="url"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notas (Opcional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Información adicional sobre la entrevista..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Agendar Entrevista
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}