import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Heart, CalendarCheck, MapPin, Crown, Plus, Clock } from '@phosphor-icons/react'
import { CraneIcon } from '@/components/CraneIcon'
import confetti from 'canvas-confetti'
import logo from '@/assets/images/1C4A8650-7D15-466A-B9FA-D8838A77CA95.png'
import { useCloudflareKV } from '@/hooks/useCloudflareKV'

interface Pledge {
  id: string
  name: string
  craneCount: number
  timestamp: number
}

function App() {
  const { 
    pledges, 
    totalReceived, 
    totalPledged, 
    loading, 
    error, 
    addPledge 
  } = useCloudflareKV()
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [daysUntil, setDaysUntil] = useState(0)
  
  const [name, setName] = useState('')
  const [craneCount, setCraneCount] = useState('')

  useEffect(() => {
    const calculateDays = () => {
      const targetDate = new Date('2025-10-22T00:00:00')
      const today = new Date()
      const diffTime = targetDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysUntil(diffDays > 0 ? diffDays : 0)
    }

    calculateDays()
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const totalReceivedValue = totalReceived || 0
  const pledgeProgress = Math.min((totalPledged / 1000) * 100, 100)
  const receivedProgress = Math.min((totalReceivedValue / 1000) * 100, 100)

  const sortedPledges = [...(pledges || [])].sort((a, b) => b.craneCount - a.craneCount)

  const handlePledgeSubmit = async (e: React.FormEvent) => {
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

    const result = await addPledge({
      name: name.trim(),
      craneCount: count
    })

    if (result.success) {
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
    } else {
      toast.error('Failed to save pledge. Please try again.')
    }
  }



  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {loading && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="text-center">
            <CraneIcon className="w-16 h-16 text-primary mx-auto mb-4 crane-float" />
            <p className="text-lg font-semibold">Loading cranes...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50">
          <p>Error: {error}</p>
        </div>
      )}
      
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <CraneIcon className="absolute top-20 left-10 w-16 h-16 text-primary crane-float" style={{ animationDelay: '0s' }} />
        <CraneIcon className="absolute top-40 right-20 w-12 h-12 text-accent crane-float" style={{ animationDelay: '2s' }} />
        <CraneIcon className="absolute bottom-32 left-1/4 w-14 h-14 text-secondary crane-float" style={{ animationDelay: '4s' }} />
        <CraneIcon className="absolute bottom-20 right-1/3 w-10 h-10 text-primary crane-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img src={logo} alt="Angie's Cranes Logo" className="w-64 h-64 md:w-80 md:h-80" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join us in honoring the Japanese tradition of <em>senbazuru</em> - folding 1000 paper cranes for healing and good fortune. 
            Angela is receiving a stem cell transplant, and we're asking friends and community to send origami cranes to celebrate her journey.
          </p>
        </header>

        <Card className="p-8 shadow-lg mb-8 bg-gradient-to-br from-accent/10 to-primary/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-accent" weight="fill" />
            <h2 className="text-3xl font-semibold">Countdown to Transplant</h2>
          </div>
          <div className="text-center">
            <div className="text-7xl md:text-8xl font-bold text-accent mb-2">
              {daysUntil}
            </div>
            <p className="text-2xl text-muted-foreground">
              {daysUntil === 1 ? 'day' : 'days'} until October 22, 2025
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="w-6 h-6 text-accent" weight="fill" />
              <h2 className="text-2xl font-semibold">Important Date</h2>
            </div>
            <p className="text-3xl font-bold text-accent mb-2">October 22, 2025</p>
            <p className="text-muted-foreground">Hospital Admission day - our goal is 1000 cranes by this date!</p>
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

        <Card className="p-6 shadow-lg mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CraneIcon className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold">Need Origami Paper?</h2>
          </div>
          <p className="text-center text-muted-foreground mb-6">
            Get the perfect paper for your origami cranes! We've found some great options on Amazon:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://www.amazon.com/Origami-Paper-Double-Sided-Color/dp/B06XW45PMR/ref=sr_1_6?crid=K8BEXAQIX4OI&dib=eyJ2IjoiMSJ9.bKWCEzbw6PtRJj5TujoBrZTtN9FJF3LWkWMxOKh8EI25w_Kx-wQo6lMS3CJLjT1ZOlRDUjYZTeQqREKFKwFARhhWoO323HqWe9oeQOVcrJKCt20MejcLm61Qfpr3EleXSAwf_hs_uCABGixYBrzUQ2UiPiHJK7vU_UmCPC22P2vsPlDm110dgRqNZZYQpvPbL0v5foNlH_LDvJqeCNacm46GQH9JCv5w1HrZHE_eoZBFrqHKIuBNOQjb9dWXcGks5irzzSgje0sc0iHKHmnEPmumpkZc1kV-1beoBp4X9WU.gYeK3WNjtdb_mn8UIcYNgYHwRjbTuo0tDt2rPMUeRt8&dib_tag=se&keywords=origami+paper&qid=1760133350&sprefix=origami+paper%2Caps%2C185&sr=8-6"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="p-4 hover:shadow-md transition-shadow border-2 hover:border-primary/30">
                <h3 className="font-semibold text-lg mb-2 text-primary">💰 Simple Option</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Double-sided colored origami paper
                </p>
                <Button variant="outline" className="w-full">
                  View on Amazon →
                </Button>
              </Card>
            </a>
            <a
              href="https://www.amazon.com/PAPERKIDDO-Japanese-Different-Printing-Bronzing/dp/B089PV2261/ref=sr_1_17?crid=1NYJ3TNXGH4UR&dib=eyJ2IjoiMSJ9.dz3XEI5clWTmap60aS7dUufUS9400n8BlNj9fDK4h0G77Ccb_zGxR4a4QFvKtiESthRoklFWVfHmuieH0GbeuEr2vUgi2l-nJ5WmzqWdvl7PPGzVSHhLfrLG2YjzpOA7qGcWX8l3EzUv4VOinRbyjuKjXr5JtjtMJXNa1BYb-ovsfk8guSqL6IZc4xyBJ52rosFYiCUZvX7kF6PriUlmRbaHx66uOkTekXqPOWIIm0QuX04rI4Vkp2sw5lhn9KT1lvNDjhXDITqRUDW1_vAbNeDcq2qXAhtsAn9WRFt4Dms.CYH5FPfPYpC6wO12hCj2GqmhDCdPYkusawoRnVkThJQ&dib_tag=se&keywords=fancy+origami+paper+designs&qid=1760133604&sprefix=fancy+origami+paper+designs%2Caps%2C168&sr=8-17"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="p-4 hover:shadow-md transition-shadow border-2 hover:border-accent/30">
                <h3 className="font-semibold text-lg mb-2 text-accent">✨ Fancy Option</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Double-sided patterned origami paper
                </p>
                <Button variant="outline" className="w-full">
                  View on Amazon →
                </Button>
              </Card>
            </a>
          </div>
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

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Made with love and hope for Angela's healing journey 💝</p>
        </footer>
      </div>
    </div>
  )
}

export default App