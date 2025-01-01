import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResultsDisplay({ loading, error, data }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2, mt: 4, bgcolor: '#fff4f4' }}>
        <Typography color="error">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!data) return null;

  const prepareHourlyData = () => {
    return Object.entries(data.timeAnalysis.messagesByHour).map(([hour, count]) => ({
      hour: `${hour}h`,
      mensagens: count
    }));
  };

  const getUserStats = () => {
    return Object.entries(data.userStats).map(([name, stats]) => ({
      name,
      ...stats,
      averageWords: Math.round(stats.wordCount / stats.messageCount)
    }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Resumo Geral */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Análise de Conversas
            </Typography>
            <Typography variant="body1">
              Período: {data.dateRange}
            </Typography>
            <Typography variant="body1">
              Total de mensagens: {data.messageCount}
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfico de Mensagens por Hora */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Distribuição de Mensagens por Hora
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareHourlyData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="mensagens" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Estatísticas por Usuário */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Participação por Usuário
            </Typography>
            <List>
              {getUserStats().map((user, index) => (
                <React.Fragment key={user.name}>
                  <ListItem>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2">
                            Mensagens: {user.messageCount} | 
                            Média de palavras: {user.averageWords}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  {index < getUserStats().length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Últimas Mensagens */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Últimas Mensagens
            </Typography>
            <List>
              {data.rawConversations.slice(-5).map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={msg.text}
                    secondary={`${msg.name_user} - ${new Date(msg.timestamp * 1000).toLocaleString('pt-BR')}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
