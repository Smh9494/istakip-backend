// 👥 ========== USER MANAGEMENT API ==========
const usersDosyaYolu = path.join(dataKlasoru, "users.json");
const userGroupsDosyaYolu = path.join(dataKlasoru, "user-groups.json");
const permissionsDosyaYolu = path.join(dataKlasoru, "permissions.json");

// Dosya yoksa oluştur
if (!fs.existsSync(usersDosyaYolu)) fs.writeFileSync(usersDosyaYolu, "[]");
if (!fs.existsSync(userGroupsDosyaYolu)) fs.writeFileSync(userGroupsDosyaYolu, "[]");
if (!fs.existsSync(permissionsDosyaYolu)) fs.writeFileSync(permissionsDosyaYolu, "{}");

// 🔐 Kullanıcı doğrulama
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]");
    
    const user = users.find(u => u.username === username && u.password === password && u.status === 'active');
    
    if (!user) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    // Son giriş zamanını güncelle
    user.lastLogin = new Date().toISOString();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      message: "Giriş başarılı", 
      user: userWithoutPassword,
      permissions: getUserPermissions(user.groups)
    });
  } catch (err) {
    console.error("❌ Login hatası:", err);
    res.status(500).json({ error: "Giriş yapılamadı" });
  }
});

// Kullanıcı yetkilerini getir
function getUserPermissions(userGroups) {
  try {
    const permissionsData = fs.readFileSync(permissionsDosyaYolu, "utf8");
    const permissions = JSON.parse(permissionsData || "{}");
    
    const userPermissions = {
      pages: {},
      features: {}
    };

    // Sayfa yetkilerini kontrol et
    Object.keys(permissions.pages || {}).forEach(pageKey => {
      const page = permissions.pages[pageKey];
      const pagePermissions = [];
      
      userGroups.forEach(group => {
        if (page.permissions[group]) {
          pagePermissions.push(...page.permissions[group]);
        }
      });
      
      userPermissions.pages[pageKey] = [...new Set(pagePermissions)];
    });

    // Özellik yetkilerini kontrol et
    Object.keys(permissions.features || {}).forEach(featureKey => {
      const feature = permissions.features[featureKey];
      const featurePermissions = [];
      
      userGroups.forEach(group => {
        if (feature.permissions[group]) {
          featurePermissions.push(...feature.permissions[group]);
        }
      });
      
      userPermissions.features[featureKey] = [...new Set(featurePermissions)];
    });

    return userPermissions;
  } catch (err) {
    console.error("❌ Yetki hesaplama hatası:", err);
    return { pages: {}, features: {} };
  }
}

// 👥 Kullanıcıları getir
app.get("/api/users", (req, res) => {
  try {
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]").map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (err) {
    console.error("❌ Kullanıcılar okuma hatası:", err);
    res.status(500).json({ error: "Kullanıcılar okunamadı" });
  }
});

// 👤 Yeni kullanıcı oluştur
app.post("/api/users", (req, res) => {
  try {
    const yeniKullanici = {
      id: `user_${Date.now()}`,
      ...req.body,
      status: req.body.status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(data || "[]");
    
    // Username kontrolü
    const existingUser = users.find(u => u.username === yeniKullanici.username);
    if (existingUser) {
      return res.status(400).json({ error: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    users.push(yeniKullanici);
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = yeniKullanici;
    res.status(200).json({ message: "Kullanıcı oluşturuldu", user: userWithoutPassword });
  } catch (err) {
    console.error("❌ Kullanıcı oluşturma hatası:", err);
    res.status(500).json({ error: "Kullanıcı oluşturulamadı" });
  }
});

// ✏️ Kullanıcıyı güncelle
app.put("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    let users = JSON.parse(data || "[]");
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    users[userIndex] = { ...users[userIndex], ...updateData };
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = users[userIndex];
    res.json({ message: "Kullanıcı güncellendi", user: userWithoutPassword });
  } catch (err) {
    console.error("❌ Kullanıcı güncelleme hatası:", err);
    res.status(500).json({ error: "Kullanıcı güncellenemedi" });
  }
});

// 🗑️ Kullanıcıyı sil
app.delete("/api/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    const data = fs.readFileSync(usersDosyaYolu, "utf8");
    let users = JSON.parse(data || "[]");
    
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı" });
    }

    users.splice(userIndex, 1);
    fs.writeFileSync(usersDosyaYolu, JSON.stringify(users, null, 2));
    
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    console.error("❌ Kullanıcı silme hatası:", err);
    res.status(500).json({ error: "Kullanıcı silinemedi" });
  }
});

// 👥 Kullanıcı gruplarını getir
app.get("/api/user-groups", (req, res) => {
  try {
    const data = fs.readFileSync(userGroupsDosyaYolu, "utf8");
    const groups = JSON.parse(data || "[]");
    res.json(groups);
  } catch (err) {
    console.error("❌ Kullanıcı grupları okuma hatası:", err);
    res.status(500).json({ error: "Kullanıcı grupları okunamadı" });
  }
});

// 🔐 Yetki matrisini getir
app.get("/api/permissions", (req, res) => {
  try {
    const data = fs.readFileSync(permissionsDosyaYolu, "utf8");
    const permissions = JSON.parse(data || "{}");
    res.json(permissions);
  } catch (err) {
    console.error("❌ Yetkiler okuma hatası:", err);
    res.status(500).json({ error: "Yetkiler okunamadı" });
  }
});

// ✏️ Yetki matrisini güncelle
app.put("/api/permissions", (req, res) => {
  try {
    const updatedPermissions = req.body;
    fs.writeFileSync(permissionsDosyaYolu, JSON.stringify(updatedPermissions, null, 2));
    
    // Frontend'e cache temizleme signal'ı gönder
    res.json({ 
      message: "Yetkiler güncellendi", 
      permissions: updatedPermissions,
      clearCache: true,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error("❌ Yetki güncelleme hatası:", err);
    res.status(500).json({ error: "Yetkiler güncellenemedi" });
  }
});

// 🔍 Kullanıcının belirli bir sayfa/özellik için yetkisini kontrol et
app.get("/api/check-permission/:userId/:resource/:action", (req, res) => {
  try {
    const { userId, resource, action } = req.params;
    
    const userData = fs.readFileSync(usersDosyaYolu, "utf8");
    const users = JSON.parse(userData || "[]");
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı", hasPermission: false });
    }

    const userPermissions = getUserPermissions(user.groups);
    const hasPermission = checkUserPermission(userPermissions, resource, action);
    
    res.json({ hasPermission, user: user.username, resource, action });
  } catch (err) {
    console.error("❌ Yetki kontrol hatası:", err);
    res.status(500).json({ error: "Yetki kontrol edilemedi", hasPermission: false });
  }
});

// Yetki kontrol fonksiyonu
function checkUserPermission(userPermissions, resource, action) {
  // Sayfa yetkilerini kontrol et
  if (userPermissions.pages[resource]) {
    return userPermissions.pages[resource].includes(action);
  }
  
  // Özellik yetkilerini kontrol et
  if (userPermissions.features[resource]) {
    return userPermissions.features[resource].includes(action);
  }
  
  return false;
}
