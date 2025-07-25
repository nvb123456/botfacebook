import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { Gift, Users, Clock, CheckCircle, Plus, Trash2, Copy, Settings, MessageCircle, Download, Facebook } from "lucide-react";

interface Stats {
  total: number;
  used: number;
  remaining: number;
  totalUsers: number;
}

interface BotUser {
  id: string;
  facebookId: string;
  name: string;
  usedCode: string | null;
  receivedAt: string;
}

interface BotSettings {
  id: string;
  brandName: string;
  appUrl: string;
  welcomeMessage: string;
  autoReply: boolean;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [newCode, setNewCode] = useState("");
  const [bulkCodes, setBulkCodes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Queries
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: botUsers = [], isLoading: usersLoading } = useQuery<BotUser[]>({
    queryKey: ["/api/bot-users"],
  });

  const { data: giftCodes = [], isLoading: codesLoading } = useQuery<Array<{ code: string; isUsed: boolean }>>({
    queryKey: ["/api/gift-codes"],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<BotSettings>({
    queryKey: ["/api/bot-settings"],
  });

  // Mutations
  const addCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("POST", "/api/gift-codes", { code });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setNewCode("");
      toast({ title: "Thành công", description: "Đã thêm mã code mới" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể thêm mã code", variant: "destructive" });
    },
  });

  const addBulkCodesMutation = useMutation({
    mutationFn: async (codes: string[]) => {
      const response = await apiRequest("POST", "/api/gift-codes/bulk", { codes });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setBulkCodes("");
      toast({ title: "Thành công", description: `Đã thêm ${data.addedCodes.length} mã code` });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể thêm mã code", variant: "destructive" });
    },
  });

  const deleteCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest("DELETE", `/api/gift-codes/${code}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gift-codes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Thành công", description: "Đã xóa mã code" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa mã code", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (facebookId: string) => {
      const response = await apiRequest("DELETE", `/api/bot-users/${facebookId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Thành công", description: "Đã xóa người dùng" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể xóa người dùng", variant: "destructive" });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (updatedSettings: Partial<BotSettings>) => {
      const response = await apiRequest("PUT", "/api/bot-settings", updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-settings"] });
      toast({ title: "Thành công", description: "Đã lưu cài đặt" });
    },
    onError: () => {
      toast({ title: "Lỗi", description: "Không thể lưu cài đặt", variant: "destructive" });
    },
  });

  const handleAddCode = () => {
    if (newCode.trim()) {
      addCodeMutation.mutate(newCode.trim());
    }
  };

  const handleAddBulkCodes = () => {
    if (bulkCodes.trim()) {
      const codes = bulkCodes.split('\n').map(code => code.trim()).filter(code => code.length > 0);
      addBulkCodesMutation.mutate(codes);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Đã sao chép", description: "Đã sao chép vào clipboard" });
  };

  const filteredUsers = botUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.facebookId.includes(searchTerm) ||
    (user.usedCode && user.usedCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const webhookUrl = `${window.location.origin}/api/webhook`;
  const verifyToken = "your_verify_token_123";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Facebook className="text-blue-600 h-8 w-8" />
                <h1 className="text-xl font-semibold text-gray-900">Facebook Bot Manager</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Bot đang hoạt động</span>
              </div>
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng mã code</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.total || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Gift className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã sử dụng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.used || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Còn lại</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.remaining || 0}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Người dùng</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bot Preview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Message Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-blue-600" />
                  Xem trước tin nhắn bot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Bot Welcome Message */}
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-xs">
                  <div className="text-sm text-gray-900">
                    🎮 Chào bạn đến với hệ thống hỗ trợ của <strong>{settings?.brandName || "GameShop"}</strong>
                    <br /><br />
                    💥 Nhận code quà tặng 10k khi tạo tài khoản và xác thực số điện thoại thành công (gift chỉ sử dụng được khi xác thực sdt thành công)
                    <br /><br />
                    👇 Nhấn "Bắt đầu" để nhận ngay!
                  </div>
                </div>

                {/* User Response */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm p-3 max-w-xs">
                    <p className="text-sm">Bắt đầu</p>
                  </div>
                </div>

                {/* Bot Menu */}
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-xs">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start text-sm">
                      🎁 Nhận code
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      📲 Tải app
                    </Button>
                  </div>
                </div>

                {/* Bot Code Response */}
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm p-4 max-w-xs">
                  <div className="text-sm text-gray-900">
                    🎉 Chúc mừng! Đây là mã code của bạn:
                    <br /><br />
                    <code className="bg-yellow-100 px-2 py-1 rounded font-mono text-xs">GIFT10K2024</code>
                    <br /><br />
                    📲 Tải app tại: {settings?.appUrl || "Test.com"}
                    <br /><br />
                    ⚠️ Lưu ý: Mỗi người chỉ nhận 1 lần duy nhất!
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Webhook Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Webhook URL</Label>
                  <div className="flex mt-2">
                    <Input
                      value={webhookUrl}
                      readOnly
                      className="flex-1 rounded-r-none"
                    />
                    <Button
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(webhookUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Verify Token</Label>
                  <div className="flex mt-2">
                    <Input
                      value={verifyToken}
                      readOnly
                      className="flex-1 rounded-r-none"
                    />
                    <Button
                      variant="outline"
                      className="rounded-l-none"
                      onClick={() => copyToClipboard(verifyToken)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Hướng dẫn setup:</h4>
                  <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Vào Facebook Developer Console</li>
                    <li>Tạo ứng dụng mới hoặc chọn ứng dụng có sẵn</li>
                    <li>Thêm sản phẩm "Messenger"</li>
                    <li>Cấu hình Webhook với URL và Verify Token trên</li>
                    <li>Đăng ký các sự kiện: messages, messaging_postbacks</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Download Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5 text-green-600" />
                  Tải source code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Tải toàn bộ source code chatbot để triển khai trên server riêng
                </p>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.open('/download', '_blank')}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải file facebook-gift-bot.tar.gz
                </Button>
                <div className="mt-3 text-xs text-gray-500">
                  File chứa: Source code + Hướng dẫn setup + Mã code mẫu
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quản lý mã code</CardTitle>
                  <Button onClick={handleAddCode} disabled={addCodeMutation.isPending}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm code
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Code Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Thêm code mới</h3>
                  <div className="flex space-x-3 mb-3">
                    <Input
                      placeholder="Nhập mã code (VD: GIFT10K2024)"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddCode}
                      disabled={addCodeMutation.isPending || !newCode.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Thêm
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 mb-1">
                      Hoặc thêm nhiều code cùng lúc (mỗi dòng 1 code):
                    </Label>
                    <Textarea
                      rows={3}
                      placeholder="GIFT10K001&#10;GIFT10K002&#10;GIFT10K003"
                      value={bulkCodes}
                      onChange={(e) => setBulkCodes(e.target.value)}
                      className="resize-none"
                    />
                    <Button
                      onClick={handleAddBulkCodes}
                      disabled={addBulkCodesMutation.isPending || !bulkCodes.trim()}
                      className="mt-2"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Thêm tất cả
                    </Button>
                  </div>
                </div>

                {/* Available Codes */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Mã code có sẵn</h3>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {codesLoading ? (
                      <div className="text-center py-4">Đang tải...</div>
                    ) : giftCodes.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">Chưa có mã code nào</div>
                    ) : (
                      giftCodes.map((codeItem) => (
                        <div key={codeItem.code} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <code className="font-mono text-sm font-medium text-green-800">
                              {codeItem.code}
                            </code>
                            <Badge variant="secondary" className="text-green-600">
                              Chưa sử dụng
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCodeMutation.mutate(codeItem.code)}
                            disabled={deleteCodeMutation.isPending}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Người dùng đã nhận code</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facebook ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mã code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {usersLoading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">
                            Đang tải...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            Chưa có người dùng nào
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                              {user.facebookId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <Users className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                {user.usedCode}
                              </code>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.receivedAt).toLocaleString('vi-VN')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteUserMutation.mutate(user.facebookId)}
                                disabled={deleteUserMutation.isPending}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                                Xóa
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Bot Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt Bot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {settingsLoading ? (
                  <div className="text-center">Đang tải...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="brandName">Tên thương hiệu</Label>
                        <Input
                          id="brandName"
                          value={settings?.brandName || ""}
                          onChange={(e) => {
                            if (settings) {
                              updateSettingsMutation.mutate({ ...settings, brandName: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="appUrl">Link tải app</Label>
                        <Input
                          id="appUrl"
                          type="url"
                          value={settings?.appUrl || ""}
                          onChange={(e) => {
                            if (settings) {
                              updateSettingsMutation.mutate({ ...settings, appUrl: e.target.value });
                            }
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="welcomeMessage">Tin nhắn chào mừng</Label>
                      <Textarea
                        id="welcomeMessage"
                        rows={4}
                        value={settings?.welcomeMessage || ""}
                        onChange={(e) => {
                          if (settings) {
                            updateSettingsMutation.mutate({ ...settings, welcomeMessage: e.target.value });
                          }
                        }}
                        className="resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-blue-900">Auto-reply Bot</h3>
                        <p className="text-xs text-blue-700">Tự động phản hồi tin nhắn từ người dùng</p>
                      </div>
                      <Switch
                        checked={settings?.autoReply || false}
                        onCheckedChange={(checked) => {
                          if (settings) {
                            updateSettingsMutation.mutate({ ...settings, autoReply: checked });
                          }
                        }}
                      />
                    </div>

                    <Separator />

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">
                        Khôi phục
                      </Button>
                      <Button disabled={updateSettingsMutation.isPending}>
                        <Settings className="mr-2 h-4 w-4" />
                        Lưu cài đặt
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
