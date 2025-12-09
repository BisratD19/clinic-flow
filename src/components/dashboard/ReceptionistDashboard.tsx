import React from 'react';
import { getDashboardStats, mockPatients, mockPayments } from '@/lib/mock-data';
import StatsCard from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Clock, 
  CreditCard, 
  DollarSign,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ReceptionistDashboard = () => {
  const stats = getDashboardStats('receptionist');
  
  const todayPatients = mockPatients.filter(p => p.created_at.startsWith('2024-12-09'));
  const pendingPatients = todayPatients.filter(p => !p.is_seen);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">Patient registration and queue management</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/register-patient">
            <UserPlus className="w-4 h-4 mr-2" />
            Register New Patient
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Registrations"
          value={stats.todayRegistrations || 0}
          icon={UserPlus}
          description="New patients"
          iconClassName="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Queue Length"
          value={stats.queueLength || 0}
          icon={Clock}
          description="Waiting to be seen"
          iconClassName="bg-warning/10 text-warning"
        />
        <StatsCard
          title="Pending Payments"
          value={stats.pendingPayments || 0}
          icon={CreditCard}
          description="Awaiting confirmation"
          iconClassName="bg-destructive/10 text-destructive"
        />
        <StatsCard
          title="Total Collected"
          value={`${stats.totalCollected || 0} ETB`}
          icon={DollarSign}
          description="Today's revenue"
          iconClassName="bg-success/10 text-success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Today's Patient Queue
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/queue">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pendingPatients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No patients waiting in queue.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingPatients.slice(0, 5).map((patient) => (
                  <div 
                    key={patient.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning font-bold">
                        #{patient.queue_number}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {patient.first_name} {patient.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Assigned to: Dr. {patient.assigned_doctor?.first_name || 'Unassigned'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={patient.is_seen ? "default" : "secondary"}>
                      {patient.is_seen ? 'Seen' : 'Waiting'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-success" />
              Recent Payments
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/payments">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPayments.slice(0, 5).map((payment) => {
                const patient = mockPatients.find(p => p.id === payment.patient);
                return (
                  <div 
                    key={payment.id} 
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        payment.status === 'paid' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                      }`}>
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {patient?.first_name} {patient?.last_name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{payment.amount} ETB</span>
                          <span>•</span>
                          <span className="capitalize">{payment.payment_method}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={payment.status === 'paid' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {payment.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
