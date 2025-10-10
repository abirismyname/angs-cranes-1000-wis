import { useKV } from '@github/spark/hooks'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Heart, CalendarCheck, MapPin, Crown, Plus } from '@phosphor-icons/react'
import { CraneIcon } from '@/components/CraneIcon'
import confetti from 'canvas-confetti'

interface Pledge {
  id: string
  name: string
  craneCount: number
  timestamp: number
}

function App() {
  const [pledges, setPledges] = useKV<Pledge[]>('pledges', [])
  const [totalReceived, setTotalReceived] = useKV<number>('total-received', 0)
  const [isOwner, setIsOwner] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [adminDialogOpen, setAdminDialogOpen] = useState(false)
  
  const [name, setName] = useState('')
  const [craneCount, setCraneCount] = useState('')
  const [adminCount, setAdminCount] = useState('')

  useEffect(() => {
    window.spark.user().then(user => {
      if (user) {
        setIsOwner(user.isOwner)
      }
    })
  }, [])

  const totalPledged = (pledges || []).reduce((sum, pledge) => sum + pledge.craneCount, 0)
  const totalReceivedValue = totalReceived || 0
  const pledgeProgress = Math.min((totalPledged / 1000) * 100, 100)
  const receivedProgress = Math.min((totalReceivedValue / 1000) * 100, 100)

  const sortedPledges = [...(pledges || [])].sort((a, b) => b.craneCount - a.craneCount)

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const count = parseInt(craneCount)
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (isNaN(count) || count <= 0) {
      toast.error('Please enter a valid number of cranes')
      return
    }

    const newPledge: Pledge = {
      id: Date.now().toString(),
      name: name.trim(),
      craneCount: count,
      timestamp: Date.now()
    }

    setPledges(current => [...(current || []), newPledge])
    
    toast.success(`Thank you ${name}! Your pledge of ${count} crane${count > 1 ? 's' : ''} has been recorded! 🎉`)
    
    if (totalPledged + count >= 1000 && totalPledged < 1000) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
    
    setName('')
    setCraneCount('')
    setDialogOpen(false)
  }

  const handleAdminUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    
    const count = parseInt(adminCount)
    if (isNaN(count) || count < 0) {
      toast.error('Please enter a valid number')
      return
    }

    setTotalReceived(count)
    toast.success(`Total received updated to ${count} cranes!`)
    
    const prevReceived = totalReceived || 0
    if (count >= 1000 && prevReceived < 1000) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      })
    }
    
    setAdminCount('')
    setAdminDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <CraneIcon className="absolute top-20 left-10 w-16 h-16 text-primary crane-float" style={{ animationDelay: '0s' }} />
        <CraneIcon className="absolute top-40 right-20 w-12 h-12 text-accent crane-float" style={{ animationDelay: '2s' }} />
        <CraneIcon className="absolute bottom-32 left-1/4 w-14 h-14 text-secondary crane-float" style={{ animationDelay: '4s' }} />
        <CraneIcon className="absolute bottom-20 right-1/3 w-10 h-10 text-primary crane-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CraneIcon className="w-12 h-12 text-accent" />
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">Ang's Cranes</h1>
            <CraneIcon className="w-12 h-12 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join us in honoring the Japanese tradition of <em>senbazuru</em> - folding 1000 paper cranes for healing and good fortune. 
            Angela is receiving a stem cell transplant, and we're asking friends and community to send origami cranes to celebrate her journey.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="w-6 h-6 text-accent" weight="fill" />
              <h2 className="text-2xl font-semibold">Important Date</h2>
            </div>
            <p className="text-3xl font-bold text-accent mb-2">October 22, 2025</p>
            <p className="text-muted-foreground">Transplant day - our goal is 1000 cranes by this date!</p>
          </Card>

          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" weight="fill" />
              <h2 className="text-2xl font-semibold">Mail Cranes To</h2>
            </div>
            <p className="text-lg font-semibold mb-1">Angela's Cranes</p>
            <p className="text-muted-foreground leading-relaxed">
              3410 E Escuda Rd<br />
              Phoenix, AZ 85050
            </p>
          </Card>
        </div>

        <Card className="p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Our Progress</h2>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Cranes Pledged</span>
                <Badge className="text-lg px-3 py-1" variant="secondary">
                  {totalPledged} / 1000
                </Badge>
              </div>
              <Progress value={pledgeProgress} className="h-4" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Cranes Received</span>
                <Badge className="text-lg px-3 py-1 bg-accent text-accent-foreground">
                  {totalReceivedValue} / 1000
                </Badge>
              </div>
              <Progress value={receivedProgress} className="h-4" />
            </div>
          </div>

          {(totalPledged >= 1000 || totalReceivedValue >= 1000) && (
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-accent">🎉 Goal Reached! Thank you all! 🎉</p>
            </div>
          )}
        </Card>

        <div className="flex justify-center mb-8">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-6 h-6 mr-2" weight="bold" />
                Make a Pledge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">Pledge Your Cranes</DialogTitle>
              </DialogHeader>
              <form onSubmit={handlePledgeSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="crane-count">Number of Cranes</Label>
                  <Input
                    id="crane-count"
                    type="number"
                    min="1"
                    value={craneCount}
                    onChange={(e) => setCraneCount(e.target.value)}
                    placeholder="How many cranes will you fold?"
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Heart className="w-5 h-5 mr-2" weight="fill" />
                  Submit Pledge
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-6 h-6 text-accent" weight="fill" />
            <h2 className="text-3xl font-semibold">Leaderboard</h2>
          </div>
          
          {sortedPledges.length === 0 ? (
            <div className="text-center py-12">
              <CraneIcon className="w-24 h-24 text-muted mx-auto mb-4 opacity-30" />
              <p className="text-lg text-muted-foreground">Be the first to pledge cranes for Angela!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedPledges.map((pledge, index) => (
                <div
                  key={pledge.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                    index % 2 === 0 ? 'bg-muted/30' : 'bg-card/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {index < 3 && (
                      <Crown 
                        className={`w-5 h-5 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          'text-amber-600'
                        }`}
                        weight="fill"
                      />
                    )}
                    <span className="font-semibold text-lg">{pledge.name}</span>
                  </div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {pledge.craneCount} crane{pledge.craneCount > 1 ? 's' : ''}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {isOwner && (
          <Card className="p-6 shadow-lg mt-8 border-2 border-accent">
            <h3 className="text-xl font-semibold mb-4 text-accent">Admin Controls</h3>
            <Dialog open={adminDialogOpen} onOpenChange={setAdminDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Update Total Received
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Cranes Received</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdminUpdate} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="admin-count">Total Cranes Received</Label>
                    <Input
                      id="admin-count"
                      type="number"
                      min="0"
                      value={adminCount}
                      onChange={(e) => setAdminCount(e.target.value)}
                      placeholder={`Current: ${totalReceivedValue}`}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Update Count
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        )}

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Made with love and hope for Angela's healing journey 💝</p>
        </footer>
      </div>
    </div>
  )
}

export default App