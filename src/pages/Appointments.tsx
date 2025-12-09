import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { mockAppointments, Appointment } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Search,
  User,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Appointments = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filter appointments based on user role
  let appointments = mockAppointments;
  if (user?.role === 'doctor') {
    appointments = mockAppointments.filter(a => a.doctor.id === user.id);
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.patient.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patient.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor.first_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'initial') return matchesSearch && apt.appointment_type === 'initial';
    if (activeTab === 'follow_up') return matchesSearch && apt.appointment_type === 'follow_up';
    if (activeTab === 'pending') return matchesSearch && apt.status === 'pending';
    if (activeTab === 'completed') return matchesSearch && apt.status === 'completed';
    return matchesSearch;
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'completed': return 'bg-success/10 text-success border-success/20';
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-muted-foreground">
          {user?.role === 'doctor' ? 'Your scheduled appointments' : 'All hospital appointments'}
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient or doctor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-xl">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="initial">Initial</TabsTrigger>
          <TabsTrigger value="follow_up">Follow-up</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-4">
            {filteredAppointments.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredAppointments.map((apt) => (
                <Card key={apt.id} className="hover:shadow-md transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {apt.patient.first_name[0]}{apt.patient.last_name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {apt.patient.first_name} {apt.patient.last_name}
                            </h3>
                            <Badge variant="outline" className="text-xs capitalize">
                              {apt.appointment_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              Dr. {apt.doctor.first_name} {apt.doctor.last_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(apt.appointment_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                              {apt.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:flex-shrink-0">
                        <Badge className={`capitalize gap-1 ${getStatusColor(apt.status)}`}>
                          {getStatusIcon(apt.status)}
                          {apt.status}
                        </Badge>
                        {user?.role === 'doctor' && apt.status === 'pending' && (
                          <Button size="sm" asChild>
                            <Link to={`/dashboard/treatments?patient=${apt.patient.id}&appointment=${apt.id}`}>
                              Treat
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
