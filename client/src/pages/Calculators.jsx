import { Card, CardContent, Typography, TextField, Grid, Button, Stack, Box } from '@mui/material';
import { useState } from 'react';

export default function Calculators() {
  const [sip, setSip] = useState({ amount: 5000, rate: 12, years: 10 });
  const [emi, setEmi] = useState({ principal: 500000, rate: 8.5, years: 5 });
  const [compound, setCompound] = useState({ principal: 100000, rate: 10, years: 5 });
  const [results, setResults] = useState({ sip: '', emi: '', compound: '' });

  const calculateSip = () => {
    const monthlyRate = sip.rate / 100 / 12;
    const months = sip.years * 12;
    const futureValue = sip.amount * (((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate);
    setResults((prev) => ({ ...prev, sip: `₹${futureValue.toFixed(0)}` }));
  };

  const calculateEmi = () => {
    const p = emi.principal;
    const r = emi.rate / 100 / 12;
    const n = emi.years * 12;
    const emiValue = (p * r * (1 + r) ** n) / (((1 + r) ** n - 1) || 1);
    setResults((prev) => ({ ...prev, emi: `₹${emiValue.toFixed(0)}` }));
  };

  const calculateCompound = () => {
    const future = compound.principal * (1 + compound.rate / 100) ** compound.years;
    setResults((prev) => ({ ...prev, compound: `₹${future.toFixed(0)}` }));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>Calculators</Typography>
      <Typography color="text.secondary" mb={3}>Estimate SIP, EMI, and compound returns quickly.</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>SIP Calculator</Typography>
              <Stack spacing={2}>
                <TextField label="Monthly Investment" type="number" value={sip.amount} onChange={(e) => setSip({ ...sip, amount: Number(e.target.value) })} />
                <TextField label="Expected Return (%)" type="number" value={sip.rate} onChange={(e) => setSip({ ...sip, rate: Number(e.target.value) })} />
                <TextField label="Years" type="number" value={sip.years} onChange={(e) => setSip({ ...sip, years: Number(e.target.value) })} />
                <Button variant="contained" onClick={calculateSip}>Calculate</Button>
                <Typography color="primary.main" fontWeight={700}>{results.sip}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>EMI Calculator</Typography>
              <Stack spacing={2}>
                <TextField label="Principal" type="number" value={emi.principal} onChange={(e) => setEmi({ ...emi, principal: Number(e.target.value) })} />
                <TextField label="Interest Rate (%)" type="number" value={emi.rate} onChange={(e) => setEmi({ ...emi, rate: Number(e.target.value) })} />
                <TextField label="Years" type="number" value={emi.years} onChange={(e) => setEmi({ ...emi, years: Number(e.target.value) })} />
                <Button variant="contained" onClick={calculateEmi}>Calculate</Button>
                <Typography color="primary.main" fontWeight={700}>{results.emi}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography fontWeight={700} gutterBottom>Compound Interest</Typography>
              <Stack spacing={2}>
                <TextField label="Principal" type="number" value={compound.principal} onChange={(e) => setCompound({ ...compound, principal: Number(e.target.value) })} />
                <TextField label="Rate (%)" type="number" value={compound.rate} onChange={(e) => setCompound({ ...compound, rate: Number(e.target.value) })} />
                <TextField label="Years" type="number" value={compound.years} onChange={(e) => setCompound({ ...compound, years: Number(e.target.value) })} />
                <Button variant="contained" onClick={calculateCompound}>Calculate</Button>
                <Typography color="primary.main" fontWeight={700}>{results.compound}</Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
