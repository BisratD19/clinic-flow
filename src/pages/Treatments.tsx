import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { mockAppointments, mockTreatments, mockPatients, Treatment, Appointment } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Stethoscope, 
  FileText,
  User,
  Calendar,
  Clock,
  Pill,
  Save,
  CalendarPlus,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

const Treatments = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const selectedPatientId = searchParams.get('patient');
  const selectedAppointmentId = searchParams.get('appointment');

  const [treatments, setTreatments] = useState<Treatment[]>(mockTreatments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If we have a selected patient, show the treatment form
  const selectedAppointment = selectedAppointmentId 
    ? mockAppointments.find(a => a.id === parseInt(selectedAppointmentId))
    : null;

  const [formData, setFormData] = useState({
    notes: '',
    prescription: '',
    follow_up_required: false,
    follow_up_date: '',
  });

  // Filter treatments for the current doctor
  const doctorTreatments = treatments.filter(t => t.doctor.id === user?.id);

  const handleSubmitTreatment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedAppointment) {
      const newTreatment: Treatment = {
        id: treatments.length + 1,
        patient: selectedAppointment.patient,
        doctor: selectedAppointment.doctor,
        appointment: selectedAppointment.id,
        notes: formData.notes,
        prescription: formData.prescription || null,
        follow_up_required: formData.follow_up_required,
        created_at: new Date().toISOString(),
      };

      setTreatments([...treatments, newTreatment]);
      toast.success('Treatment recorded successfully');

      if (formData.follow_up_required) {
        setIsDialogOpen(true);
      }
    }

    setIsLoading(false);
  };

  const handleCreateFollowUp = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Follow-up appointment scheduled');
    setIsDialogOpen(false);
    setFormData({
      notes: '',
      prescription: '',
      follow_up_required: false,
      follow_up_date: '',
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Treatments</h1>
        <p className="text-muted-foreground">Manage patient treatments and prescriptions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treatment Form */}
        {selectedAppointment ? (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Patient Treatment
              </CardTitle>
              <CardDescription>Record treatment for the current patient</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Patient Info */}
              <div className="p-4 rounded-lg bg-muted/50 mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedAppointment.patient.first_name[0]}{selectedAppointment.patient.last_name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedAppointment.patient.first_name} {selectedAppointment.patient.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Queue #{selectedAppointment.patient.queue_number} • {selectedAppointment.appointment_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {selectedAppointment.patient.gender === 'M' ? 'Male' : 'Female'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedAppointment.patient.date_of_birth || 'N/A'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitTreatment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Diagnosis & Notes *</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Enter diagnosis, symptoms, and observations..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescription" className="flex items-center gap-2">
                    <Pill className="w-4 h-4" />
                    Prescription
                  </Label>
                  <Textarea
                    id="prescription"
                    value={formData.prescription}
                    onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                    placeholder="Enter medications and dosage instructions..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label htmlFor="follow_up" className="cursor-pointer">Follow-up Required</Label>
                    <p className="text-sm text-muted-foreground">Schedule a follow-up appointment</p>
                  </div>
                  <Switch
                    id="follow_up"
                    checked={formData.follow_up_required}
                    onCheckedChange={(checked) => setFormData({...formData, follow_up_required: checked})}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Treatment
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12 text-muted-foreground">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No Patient Selected</h3>
                <p>Select a patient from your appointments to start treatment</p>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="/dashboard/appointments">View Appointments</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treatment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Treatment History
            </CardTitle>
            <CardDescription>Recent treatments you've recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {doctorTreatments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No treatments recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctorTreatments.map((treatment) => (
                  <div 
                    key={treatment.id} 
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {treatment.patient.first_name[0]}{treatment.patient.last_name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {treatment.patient.first_name} {treatment.patient.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(treatment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {treatment.follow_up_required && (
                        <Badge variant="secondary" className="text-xs">
                          Follow-up
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {treatment.notes}
                    </p>
                    {treatment.prescription && (
                      <div className="flex items-center gap-1 text-xs text-primary">
                        <Pill className="w-3 h-3" />
                        Prescription included
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Follow-up Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-primary" />
              Schedule Follow-up
            </DialogTitle>
            <DialogDescription>
              Set the date for the patient's follow-up appointment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="follow_up_date">Follow-up Date</Label>
            <Input
              id="follow_up_date"
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})}
              className="mt-2"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Skip for Now
            </Button>
            <Button onClick={handleCreateFollowUp} disabled={isLoading || !formData.follow_up_date}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Treatments;
