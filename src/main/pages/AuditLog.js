import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box, Chip } from "@mui/material";
import { getAuditLog } from "../utils/audit";

function AuditLog() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    setLog(getAuditLog().slice().reverse()); // الأحدث أولاً
  }, []);

  const colorByAction = action => {
    if (action === "add") return "success";
    if (action === "edit") return "info";
    if (action === "delete") return "error";
    if (action === "status-change") return "warning";
    return "default";
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4 }}>
        <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 700, mb: 3 }}>سجل النشاطات</Typography>
        {log.length === 0 ? (
          <Typography>لا يوجد نشاطات مسجلة بعد.</Typography>
        ) : (
          <Table sx={{ background: '#f8fafd', borderRadius: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>العملية</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>رقم الطلب</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>المستخدم</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>تفاصيل</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>الوقت</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {log.map((entry, idx) => (
                <TableRow key={idx}>
                  <TableCell><Chip label={entry.action} color={colorByAction(entry.action)} /></TableCell>
                  <TableCell>{entry.orderId}</TableCell>
                  <TableCell>{entry.username}</TableCell>
                  <TableCell>{entry.details}</TableCell>
                  <TableCell>{entry.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}

export default AuditLog;
