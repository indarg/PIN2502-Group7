import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { useCRMCommon } from 'src/context/CRMCommonContext/useCRMCommon';



type TProps = {
  finishButtonLabel?: string,
  steps: {
    label: string,
    step: ReactNode
  }[],
}

export default function HorizontalStepper({ steps, finishButtonLabel = 'Finalizar' }: TProps) {
  const {isLoading} = useCRMCommon();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  useEffect(() => {},[isLoading])

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  return (
    <Box sx={{ width: '100%',height:"100%",opacity : isLoading ? 0.4:1 }}>
      <Stepper activeStep={activeStep} sx={{marginTop:"50px"}}>
        {steps.map((step, index) => (
          <Step key={index} >
            <Button sx={{textTransform:"capitalize", cursor:"pointer"}} onClick={() => setActiveStep(index)}>
              <StepLabel >{step.label}</StepLabel>
            </Button>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1, color: "black" }} >
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Box sx={{  minHeight: "50vh", display:"flex",flexDirection:"column",flexGrow:1 }}>{steps[activeStep].step}</Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginTop: 2 }}>
            <Button
            variant='outlined'
              color='secondary'
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Atrás
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button variant='outlined' color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Omitir
              </Button>
            )}
            <Button sx={{ display: activeStep === steps.length - 1 ? `block` : `none` }} variant="outlined" type="submit" disabled={isLoading}>{finishButtonLabel}</Button>
            {activeStep !== steps.length - 1 && <Button type='button' variant='contained' color='primary' onClick={handleNext}>
              Siguiente
            </Button>}

          </Box>
        </Fragment>
      )}
    </Box>
  );
}