import React, { useState } from 'react';
import { mockDoctors, mockPatients, Patient } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  UserPlus, 
  CreditCard, 
  Check,
  Loader2,
  User,
  Phone,
  MapPin,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

const RegisterPatient = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'M' as 'M' | 'F',
    contact_number: '',
    address: '',
    assigned_doctor_id: '',
    payment_method: 'cash' as 'cash' | 'chapa',
    amount: 500,
  });

  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const doctor = mockDoctors.find(d => d.id === parseInt(formData.assigned_doctor_id)) || mockDoctors[0];
    
    const newPatient: Patient = {
      id: mockPatients.length + 1,
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender,
      contact_number: formData.contact_number,
      address: formData.address,
      assigned_doctor: doctor,
      queue_number: mockPatients.length + 1,
      is_seen: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setRegisteredPatient(newPatient);
    setStep(3);
    setIsLoading(false);
    toast.success('Patient registered successfully!');
  };

  const handlePayment = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (formData.payment_method === 'chapa') {
      toast.info('Chapa payment link generated (mock)');
    } else {
      toast.success('Cash payment recorded');
    }
    
    setStep(2);
    setIsLoading(false);
  };

  const resetForm = () => {
    setStep(1);
    setRegisteredPatient(null);
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: 'M',
      contact_number: '',
      address: '',
      assigned_doctor_id: '',
      payment_method: 'cash',
      amount: 500,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Register New Patient</h1>
        <p className="text-muted-foreground">Complete the registration form and collect payment</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {s === 1 ? 'Payment' : s === 2 ? 'Patient Info' : 'Complete'}
              </span>
            </div>
            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Payment */}
      {step === 1 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Collect Registration Fee
            </CardTitle>
            <CardDescription>
              Registration fee must be collected before proceeding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-between">
              <span className="text-muted-foreground">Registration Fee</span>
              <span className="text-2xl font-bold text-foreground">{formData.amount} ETB</span>
            </div>

            <div className="space-y-3">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, payment_method: 'cash'})}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.payment_method === 'cash' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">Cash</div>
                  <div className="text-sm text-muted-foreground">Immediate confirmation</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, payment_method: 'chapa'})}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.payment_method === 'chapa' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  <div className="font-semibold">Chapa</div>
                  <div className="text-sm text-muted-foreground">Online payment</div>
                </button>
              </div>
            </div>

            <Button 
              onClick={handlePayment} 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {formData.payment_method === 'cash' ? 'Confirm Cash Payment' : 'Generate Chapa Link'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Patient Information */}
      {step === 2 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Patient Information
            </CardTitle>
            <CardDescription>
              Enter patient details and assign a doctor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="pl-10"
                      placeholder="First name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value: 'M' | 'F') => setFormData({...formData, gender: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
                    className="pl-10"
                    placeholder="+251..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="pl-10"
                    placeholder="City, subcity..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Assign Doctor</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <Select 
                    value={formData.assigned_doctor_id} 
                    onValueChange={(value) => setFormData({...formData, assigned_doctor_id: value})}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Auto-assign (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Auto-assign</SelectItem>
                      {mockDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          Dr. {doctor.first_name} {doctor.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register Patient
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Success */}
      {step === 3 && registeredPatient && (
        <Card className="animate-scale-in">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Registration Complete!</h3>
                <p className="text-muted-foreground">Patient has been added to the queue</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Queue Number</span>
                <Badge variant="secondary" className="text-lg font-bold">
                  #{registeredPatient.queue_number}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient Name</span>
                <span className="font-medium">{registeredPatient.first_name} {registeredPatient.last_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned Doctor</span>
                <span className="font-medium">Dr. {registeredPatient.assigned_doctor?.first_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant="default">Paid</Badge>
              </div>
            </div>

            <Button onClick={resetForm} className="w-full mt-6" size="lg">
              <UserPlus className="w-4 h-4 mr-2" />
              Register Another Patient
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegisterPatient;
