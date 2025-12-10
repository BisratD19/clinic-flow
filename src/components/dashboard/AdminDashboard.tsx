import React from 'react';
import { getDashboardStats, mockUsers, mockPatients, mockAppointments } from '@/lib/mock-data';
import StatsCard from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Stethoscope, 
  UserCheck, 
  Calendar,
  UserPlus,
  TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = getDashboardStats('admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and user management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon={Users}
          description="Staff members"
          iconClassName="bg-primary/10 text-primary"
        />
        <StatsCard
          title="Doctors"
          value={stats.totalDoctors || 0}
          icon={Stethoscope}
          description="Active doctors"
          iconClassName="bg-doctor/10 text-doctor"
        />
        <StatsCard
          title="Receptionists"
          value={stats.totalReceptionists || 0}
          icon={UserCheck}
          description="Front desk staff"
          iconClassName="bg-receptionist/10 text-receptionist"
        />
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients || 0}
          icon={UserPlus}
          description="Registered today"
          iconClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* All Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Patients</CardTitle>
          <Badge variant="secondary">{mockPatients.length} total</Badge>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Gender</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Queue #</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Registered</th>
                </tr>
              </thead>
              <tbody>
                {mockPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                          {patient.first_name[0]}{patient.last_name[0]}
                        </div>
                        <span className="font-medium text-foreground">{patient.first_name} {patient.last_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{patient.contact_number}</td>
                    <td className="py-3 px-2">
                      <Badge variant="secondary" className="capitalize">{patient.gender}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline">#{patient.queue_number}</Badge>
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      {new Date(patient.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Staff Members</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <a href="/dashboard/users">View all</a>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Today's Appointments</CardTitle>
            <Badge variant="secondary" className="font-normal">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      apt.status === 'completed' ? 'bg-success' : 
                      apt.status === 'pending' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                    <div>
                      <p className="font-medium text-foreground">
                        {apt.patient.first_name} {apt.patient.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dr. {apt.doctor.first_name} • {apt.appointment_type}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={apt.status === 'completed' ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
