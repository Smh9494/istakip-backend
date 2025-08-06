// 🔄 ========== WORKFLOW ENGINE API ENDPOINTS ==========
const workflowsDosyaYolu = path.join(dataKlasoru, "workflows.json");
const activeWorkflowsDosyaYolu = path.join(dataKlasoru, "active-workflows.json");

// Dosya yoksa oluştur
if (!fs.existsSync(workflowsDosyaYolu)) fs.writeFileSync(workflowsDosyaYolu, "[]");
if (!fs.existsSync(activeWorkflowsDosyaYolu)) fs.writeFileSync(activeWorkflowsDosyaYolu, "[]");

// Workflow'ları getir
app.get("/api/workflows", (req, res) => {
  try {
    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(data || "[]");
    res.json(workflows);
  } catch (err) {
    console.error("❌ Workflows okuma hatası:", err);
    res.status(500).json({ error: "Workflows okunamadı" });
  }
});

// Yeni workflow oluştur
app.post("/api/workflows", (req, res) => {
  try {
    const yeniWorkflow = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(data || "[]");
    workflows.push(yeniWorkflow);

    fs.writeFileSync(workflowsDosyaYolu, JSON.stringify(workflows, null, 2));
    res.status(200).json({ message: "Workflow oluşturuldu", data: yeniWorkflow });
  } catch (err) {
    console.error("❌ Workflow oluşturma hatası:", err);
    res.status(500).json({ error: "Workflow oluşturulamadı" });
  }
});

// Aktif workflow'ları getir
app.get("/api/active-workflows", (req, res) => {
  try {
    const data = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    const activeWorkflows = JSON.parse(data || "[]");
    res.json(activeWorkflows);
  } catch (err) {
    console.error("❌ Active workflows okuma hatası:", err);
    res.status(500).json({ error: "Active workflows okunamadı" });
  }
});

// Workflow başlat
app.post("/api/workflows/:id/start", (req, res) => {
  try {
    const { id } = req.params;
    const { triggerData } = req.body;

    const workflowData = fs.readFileSync(workflowsDosyaYolu, "utf8");
    const workflows = JSON.parse(workflowData || "[]");
    const workflow = workflows.find(w => w.id === id);

    if (!workflow) {
      return res.status(404).json({ error: "Workflow bulunamadı" });
    }

    const aktifWorkflow = {
      id: Date.now().toString(),
      workflowId: id,
      name: workflow.name,
      currentStep: 0,
      status: 'running',
      startedAt: new Date().toISOString(),
      triggerData,
      steps: workflow.steps.map(step => ({
        ...step,
        status: 'pending',
        assignedAt: null,
        completedAt: null
      }))
    };

    // İlk adımı aktif yap
    if (aktifWorkflow.steps.length > 0) {
      aktifWorkflow.steps[0].status = 'active';
      aktifWorkflow.steps[0].assignedAt = new Date().toISOString();
    }

    const activeData = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    const activeWorkflows = JSON.parse(activeData || "[]");
    activeWorkflows.push(aktifWorkflow);

    fs.writeFileSync(activeWorkflowsDosyaYolu, JSON.stringify(activeWorkflows, null, 2));
    res.status(200).json({ message: "Workflow başlatıldı", data: aktifWorkflow });
  } catch (err) {
    console.error("❌ Workflow başlatma hatası:", err);
    res.status(500).json({ error: "Workflow başlatılamadı" });
  }
});

// Workflow adımını tamamla
app.patch("/api/active-workflows/:id/complete-step", (req, res) => {
  try {
    const { id } = req.params;
    const { stepId, result, comments } = req.body;

    const data = fs.readFileSync(activeWorkflowsDosyaYolu, "utf8");
    let activeWorkflows = JSON.parse(data || "[]");
    
    const workflowIndex = activeWorkflows.findIndex(w => w.id === id);
    if (workflowIndex === -1) {
      return res.status(404).json({ error: "Active workflow bulunamadı" });
    }

    const workflow = activeWorkflows[workflowIndex];
    const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
    
    if (stepIndex === -1) {
      return res.status(404).json({ error: "Adım bulunamadı" });
    }

    // Mevcut adımı tamamla
    workflow.steps[stepIndex] = {
      ...workflow.steps[stepIndex],
      status: 'completed',
      completedAt: new Date().toISOString(),
      result,
      comments
    };

    // Sonraki adımı aktif yap
    if (stepIndex + 1 < workflow.steps.length) {
      workflow.steps[stepIndex + 1].status = 'active';
      workflow.steps[stepIndex + 1].assignedAt = new Date().toISOString();
      workflow.currentStep = stepIndex + 1;
    } else {
      // Workflow tamamlandı
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
    }

    activeWorkflows[workflowIndex] = workflow;
    fs.writeFileSync(activeWorkflowsDosyaYolu, JSON.stringify(activeWorkflows, null, 2));
    
    res.json({ message: "Adım tamamlandı", data: workflow });
  } catch (err) {
    console.error("❌ Workflow adım tamamlama hatası:", err);
    res.status(500).json({ error: "Workflow adımı tamamlanamadı" });
  }
});

// Workflow sil
app.delete("/api/workflows/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    const data = fs.readFileSync(workflowsDosyaYolu, "utf8");
    let workflows = JSON.parse(data || "[]");
    
    const index = workflows.findIndex(w => w.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Workflow bulunamadı" });
    }

    workflows.splice(index, 1);
    fs.writeFileSync(workflowsDosyaYolu, JSON.stringify(workflows, null, 2));
    
    res.json({ message: "Workflow silindi" });
  } catch (err) {
    console.error("❌ Workflow silme hatası:", err);
    res.status(500).json({ error: "Workflow silinemedi" });
  }
});
