'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlus, faGift, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ReminderItem = {
  id: string;
  title: string;
  date: string;
  occasion: string;
  note?: string;
};

export default function ReminderPage() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [occasion, setOccasion] = useState('Birthday');
  const [note, setNote] = useState('');

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setReminders((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        date,
        occasion,
        note: note.trim() || undefined,
      },
    ]);
    setTitle('');
    setDate('');
    setOccasion('Birthday');
    setNote('');
    setShowForm(false);
  };

  const handleRemove = (id: string) => setReminders((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="mx-auto w-full max-w-4xl px-3 sm:px-4 py-8 sm:py-12 overflow-x-hidden min-h-screen bg-gradient-to-b from-pink-50/50 to-white">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Reminders</h1>
      <p className="mt-1 text-sm text-slate-600">Never miss a special day. Set reminders for birthdays, anniversaries & more.</p>

      <Card className="mt-6 sm:mt-8 border border-pink-200/80 shadow-sm hover-lift-3d transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-pink-600" />
              Gift Reminders
            </CardTitle>
            <CardDescription>Add dates and we’ll remind you before the occasion.</CardDescription>
          </div>
          <Button size="sm" className="gap-1.5 bg-pink-600 hover:bg-pink-700 hover-lift-3d transition-all duration-300" onClick={() => setShowForm(!showForm)}>
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            Add reminder
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <form onSubmit={handleAddReminder} className="rounded-lg border border-pink-200 bg-pink-50/50 p-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="reminder-title">Name / Title</Label>
                <Input
                  id="reminder-title"
                  placeholder="e.g. Mom's birthday"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="reminder-date">Date</Label>
                  <Input
                    id="reminder-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reminder-occasion">Occasion</Label>
                  <select
                    id="reminder-occasion"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                  >
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reminder-note">Note (optional)</Label>
                <Input
                  id="reminder-note"
                  placeholder="e.g. Prefer personalised mug"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!title.trim() || !date} className="bg-pink-600 hover:bg-pink-700 hover-lift-3d">Save reminder</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="border-pink-200 hover:bg-pink-50">Cancel</Button>
              </div>
            </form>
          )}

          {reminders.length === 0 && !showForm ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              <FontAwesomeIcon icon={faGift} className="mx-auto h-10 w-10 text-pink-400 mb-2" />
              <p>No reminders yet.</p>
              <p className="mt-1">Add a reminder so we can help you shop in time.</p>
              <Button variant="outline" className="mt-4 gap-1.5 border-pink-200 text-pink-600 hover:bg-pink-50 hover-lift-3d" onClick={() => setShowForm(true)}>
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
                Add your first reminder
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-pink-200">
              {reminders.map((r) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-3 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{r.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.occasion} · {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {r.note && <p className="text-xs text-muted-foreground mt-0.5">{r.note}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => handleRemove(r.id)} aria-label="Remove reminder">
                    <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/products" className="text-pink-600 font-medium hover:text-pink-700 hover:underline">Browse gifts</Link> when it’s time to shop.
      </p>
    </div>
  );
}
